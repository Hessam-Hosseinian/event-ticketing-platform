import { Body, Controller, Get, Module, OnModuleInit, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { randomBytes, createHash } from 'crypto';
import { connect, Channel, ChannelModel } from 'amqplib';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Event, Notification, Payment, PaymentState, PricingCategory, Reservation, ReservationSeat, ReservationState, Role, Seat, SeatState, Sector, Ticket, User, Venue, WaitingRoomEntry } from './entities';
import { AuthGuard, Roles } from './security';

@WebSocketGateway({cors:{origin:'*'}}) export class UpdatesGateway { @WebSocketServer() server!:Server; emit(name:string,data:unknown){this.server?.emit(name,data);} }
@Controller('auth') class AuthController {
 constructor(@InjectRepository(User) private users:Repository<User>,private jwt:JwtService){}
 @Post('register') async register(@Body() b:{email:string,password:string}){const user=this.users.create({email:b.email,passwordHash:await bcrypt.hash(b.password,12),role:Role.CUSTOMER}); await this.users.save(user); return {id:user.id,email:user.email,role:user.role};}
 @Post('login') async login(@Body() b:{email:string,password:string}){const u=await this.users.findOneBy({email:b.email}); if(!u||!await bcrypt.compare(b.password,u.passwordHash)) throw new Error('Invalid credentials'); return {accessToken:this.jwt.sign({sub:u.id,email:u.email,role:u.role})};}
 @Get('me') @UseGuards(AuthGuard) me(@Req() r:any){return r.user;}
}
@Controller('users') @UseGuards(AuthGuard) class UsersController { constructor(@InjectRepository(User)private repo:Repository<User>){} @Get() @Roles(Role.ADMIN) list(){return this.repo.find({select:['id','email','role']});} @Patch(':id/role') @Roles(Role.ADMIN) role(@Param('id')id:string,@Body('role')role:Role){return this.repo.update(id,{role});} }
@Controller('venues') class VenuesController {
 constructor(@InjectRepository(Venue)private venues:Repository<Venue>,@InjectRepository(Sector)private sectors:Repository<Sector>,@InjectRepository(Seat)private seats:Repository<Seat>){}
 @Get() list(){return this.venues.find();} @Post() create(@Body()b:Partial<Venue>){return this.venues.save(this.venues.create(b));}
 @Post(':id/sectors') async sector(@Param('id')venueId:string,@Body()b:{name:string;rows:number;seatsPerRow:number}){const s=await this.sectors.save(this.sectors.create({venueId,name:b.name})); const seats=[];for(let r=0;r<b.rows;r++)for(let n=1;n<=b.seatsPerRow;n++)seats.push(this.seats.create({sectorId:s.id,row:String.fromCharCode(65+r),number:n}));await this.seats.save(seats);return {...s,seats};}
 @Get(':id/layout') async layout(@Param('id')id:string){const sectors=await this.sectors.findBy({venueId:id});return Promise.all(sectors.map(async s=>({...s,seats:await this.seats.findBy({sectorId:s.id})})));}
}
@Controller('events') class EventsController {
 constructor(@InjectRepository(Event)private repo:Repository<Event>,@InjectRepository(ReservationSeat)private rs:Repository<ReservationSeat>){}
 @Get() list(@Query('q')q?:string,@Query('genre')genre?:string,@Query('city')city?:string){return this.repo.find({where:{published:true,...(q?{title:ILike(`%${q}%`)}:{}),...(genre?{genre}:{}),...(city?{city}:{})}});}
 @Post() create(@Body()b:Partial<Event>){return this.repo.save(this.repo.create(b));} @Patch(':id') update(@Param('id')id:string,@Body()b:Partial<Event>){return this.repo.update(id,b);} @Post(':id/publish') publish(@Param('id')id:string){return this.repo.update(id,{published:true});}
 @Get(':id/seats') async map(@Param('id')eventId:string){return this.rs.findBy({eventId});}
}
class LockService {
 private redis=new Redis(process.env.REDIS_URL??'redis://localhost:6379',{lazyConnect:true,maxRetriesPerRequest:1});
 key(e:string,s:string){return `lock:event:${e}:seat:${s}`;}
 async acquire(e:string,seats:string[],owner:string){const got:string[]=[];try{if(this.redis.status==='wait')await this.redis.connect();for(const s of seats){const ok=await this.redis.set(this.key(e,s),owner,'EX',Number(process.env.LOCK_TTL_SECONDS??600),'NX');if(!ok)throw new Error(`Seat ${s} unavailable`);got.push(s);}return got;}catch(err){await Promise.all(got.map(s=>this.redis.del(this.key(e,s))));throw err;}}
 async release(e:string,seats:string[]){await Promise.all(seats.map(s=>this.redis.del(this.key(e,s))));}
}
class BrokerService implements OnModuleInit {
 private connection?:ChannelModel; private channel?:Channel;
 async onModuleInit(){try{const connection=await connect(process.env.RABBITMQ_URL??'amqp://localhost');const channel=await connection.createChannel();this.connection=connection;this.channel=channel;await channel.assertExchange('ticketing.events','topic',{durable:true});const q=await channel.assertQueue('notifications',{durable:true});await channel.bindQueue(q.queue,'ticketing.events','#');await channel.consume(q.queue,msg=>{if(!msg)return;console.log('[notification-worker]',msg.fields.routingKey,msg.content.toString());channel.ack(msg);});}catch{console.warn('RabbitMQ unavailable; API continues and events are logged');}}
 publish(type:string,payload:unknown){const body=Buffer.from(JSON.stringify({id:randomBytes(12).toString('hex'),type,occurredAt:new Date(),payload}));if(this.channel)this.channel.publish('ticketing.events',type,body,{persistent:true});else console.log('[domain-event]',type,payload);}
}
@Controller('reservations') @UseGuards(AuthGuard) class ReservationsController {
 constructor(@InjectRepository(Reservation)private repo:Repository<Reservation>,@InjectRepository(ReservationSeat)private rs:Repository<ReservationSeat>,private locks:LockService,private ws:UpdatesGateway,private broker:BrokerService){}
 @Post() async create(@Req()r:any,@Body()b:{eventId:string;seatIds:string[]}){const id=randomBytes(16).toString('hex');await this.locks.acquire(b.eventId,b.seatIds,id);try{const reservation=await this.repo.save(this.repo.create({id,userId:r.user.sub,eventId:b.eventId,state:ReservationState.PENDING,expiresAt:new Date(Date.now()+600000)}));await this.rs.save(b.seatIds.map(seatId=>this.rs.create({reservationId:id,eventId:b.eventId,seatId,state:SeatState.LOCKED})));this.ws.emit('reservation.created',reservation);this.broker.publish('ReservationCreated',reservation);return reservation;}catch(e){await this.locks.release(b.eventId,b.seatIds);throw e;}}
 @Get(':id') get(@Param('id')id:string){return this.repo.findOneBy({id});}
 @Post(':id/cancel') async cancel(@Param('id')id:string){const r=await this.repo.findOneByOrFail({id});const seats=await this.rs.findBy({reservationId:id});await this.locks.release(r.eventId,seats.map(x=>x.seatId));await this.rs.remove(seats);r.state=ReservationState.CANCELLED;return this.repo.save(r);}
}
@Controller('payments') @UseGuards(AuthGuard) class PaymentsController {
 constructor(@InjectRepository(Payment)private pay:Repository<Payment>,@InjectRepository(Reservation)private res:Repository<Reservation>,@InjectRepository(ReservationSeat)private rs:Repository<ReservationSeat>,@InjectRepository(Ticket)private tickets:Repository<Ticket>,private locks:LockService,private ws:UpdatesGateway,private broker:BrokerService){}
 @Post() async start(@Body('reservationId')reservationId:string){const p=await this.pay.save(this.pay.create({reservationId,state:PaymentState.PENDING}));this.ws.emit('payment.started',p);this.broker.publish('PaymentStarted',p);return p;}
 @Post(':id/simulate/:outcome') async simulate(@Param('id')id:string,@Param('outcome')outcome:string){const p=await this.pay.findOneByOrFail({id});const r=await this.res.findOneByOrFail({id:p.reservationId});const seats=await this.rs.findBy({reservationId:r.id});if(outcome==='success'){p.state=PaymentState.SUCCESS;p.reference=randomBytes(8).toString('hex');r.state=ReservationState.CONFIRMED;seats.forEach(s=>s.state=SeatState.BOOKED);await this.rs.save(seats);await this.locks.release(r.eventId,seats.map(s=>s.seatId));const issued=await this.tickets.save(seats.map(s=>{const token=randomBytes(24).toString('hex');return this.tickets.create({reservationId:r.id,seatId:s.seatId,token,qrHash:createHash('sha256').update(token).digest('hex')});}));this.ws.emit('ticket.issued',issued);this.broker.publish('PaymentSucceeded',p);this.broker.publish('TicketIssued',issued);}else{p.state=outcome==='timeout'?PaymentState.TIMEOUT:PaymentState.FAILED;r.state=outcome==='timeout'?ReservationState.EXPIRED:ReservationState.CANCELLED;await this.locks.release(r.eventId,seats.map(s=>s.seatId));await this.rs.remove(seats);this.ws.emit('payment.failed',p);this.broker.publish('PaymentFailed',p);}await this.res.save(r);await this.pay.save(p);return {payment:p,reservation:r};}
}
@Controller('tickets') class TicketsController { constructor(@InjectRepository(Ticket)private repo:Repository<Ticket>){} @Get('verify/:token') async verify(@Param('token')token:string){const ticket=await this.repo.findOneBy({token});return {valid:!!ticket,ticket};}}
@Controller('waiting-room') class WaitingController { constructor(@InjectRepository(WaitingRoomEntry)private repo:Repository<WaitingRoomEntry>){} @Post(':eventId/join')async join(@Param('eventId')eventId:string,@Body('userId')userId:string){const position=await this.repo.countBy({eventId})+1;return this.repo.save(this.repo.create({eventId,userId,position,admissionToken:position<=100?randomBytes(20).toString('hex'):undefined}));}@Get(':id')status(@Param('id')id:string){return this.repo.findOneBy({id});}}
const entities=[User,Venue,Sector,Seat,Event,PricingCategory,Reservation,ReservationSeat,Payment,Ticket,Notification,WaitingRoomEntry];
@Module({imports:[JwtModule.register({global:true,secret:process.env.JWT_SECRET??'dev-secret',signOptions:{expiresIn:'1h'}}),TypeOrmModule.forRoot({type:'postgres',url:process.env.DATABASE_URL??'postgres://ticketing:ticketing@localhost:5432/ticketing',entities,synchronize:true}),TypeOrmModule.forFeature(entities)],controllers:[AuthController,UsersController,VenuesController,EventsController,ReservationsController,PaymentsController,TicketsController,WaitingController],providers:[AuthGuard,LockService,BrokerService,UpdatesGateway]}) export class AppModule {}
