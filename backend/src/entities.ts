import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
export enum Role { CUSTOMER='CUSTOMER', ORGANIZER='ORGANIZER', ADMIN='ADMIN' }
export enum SeatState { AVAILABLE='AVAILABLE', LOCKED='LOCKED', BOOKED='BOOKED' }
export enum ReservationState { PENDING='PENDING', CONFIRMED='CONFIRMED', CANCELLED='CANCELLED', EXPIRED='EXPIRED' }
export enum PaymentState { PENDING='PENDING', SUCCESS='SUCCESS', FAILED='FAILED', TIMEOUT='TIMEOUT', CANCELLED='CANCELLED' }
@Entity() @Unique(['email']) export class User { @PrimaryGeneratedColumn('uuid') id!:string; @Column() email!:string; @Column() passwordHash!:string; @Column({type:'enum',enum:Role,default:Role.CUSTOMER}) role!:Role; }
@Entity() export class Venue { @PrimaryGeneratedColumn('uuid') id!:string; @Column() name!:string; @Column() city!:string; }
@Entity() export class Sector { @PrimaryGeneratedColumn('uuid') id!:string; @Column() venueId!:string; @Column() name!:string; }
@Entity() @Unique(['sectorId','row','number']) export class Seat { @PrimaryGeneratedColumn('uuid') id!:string; @Column() sectorId!:string; @Column() row!:string; @Column() number!:number; }
@Entity() export class Event { @PrimaryGeneratedColumn('uuid') id!:string; @Column() organizerId!:string; @Column() venueId!:string; @Column() title!:string; @Column() genre!:string; @Column() city!:string; @Column('timestamptz') startsAt!:Date; @Column({default:false}) published!:boolean; }
@Entity() export class PricingCategory { @PrimaryGeneratedColumn('uuid') id!:string; @Column() eventId!:string; @Column() name!:string; @Column('decimal') price!:number; }
@Entity() export class Reservation { @PrimaryGeneratedColumn('uuid') id!:string; @Column() userId!:string; @Column() eventId!:string; @Column({type:'enum',enum:ReservationState}) state!:ReservationState; @Column('timestamptz') expiresAt!:Date; }
@Entity() @Unique(['eventId','seatId']) export class ReservationSeat { @PrimaryGeneratedColumn('uuid') id!:string; @Column() reservationId!:string; @Column() eventId!:string; @Column() seatId!:string; @Column({type:'enum',enum:SeatState}) state!:SeatState; }
@Entity() export class Payment { @PrimaryGeneratedColumn('uuid') id!:string; @Column() reservationId!:string; @Column({type:'enum',enum:PaymentState}) state!:PaymentState; @Column({nullable:true}) reference?:string; }
@Entity() @Unique(['token']) export class Ticket { @PrimaryGeneratedColumn('uuid') id!:string; @Column() reservationId!:string; @Column() seatId!:string; @Column() token!:string; @Column() qrHash!:string; }
@Entity() export class Notification { @PrimaryGeneratedColumn('uuid') id!:string; @Column() userId!:string; @Column() channel!:string; @Column() message!:string; @Column({default:false}) sent!:boolean; }
@Entity() export class WaitingRoomEntry { @PrimaryGeneratedColumn('uuid') id!:string; @Column() eventId!:string; @Column() userId!:string; @Column() position!:number; @Column({nullable:true}) admissionToken?:string; }
