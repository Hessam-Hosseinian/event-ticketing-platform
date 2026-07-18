import { Controller, ForbiddenException, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import * as QRCode from 'qrcode';
import { Repository } from 'typeorm';
import { Notification, Reservation, Role, Ticket } from './entities';
import { AuthenticatedUser, AuthGuard, Roles } from './security';

@Controller('tickets')
export class TicketsController {
  constructor(
    @InjectRepository(Ticket) private readonly tickets: Repository<Ticket>,
    @InjectRepository(Reservation) private readonly reservations: Repository<Reservation>,
  ) {}

  @Get('reservation/:id')
  @UseGuards(AuthGuard)
  async byReservation(@Req() request: { user: AuthenticatedUser }, @Param('id') reservationId: string) {
    const reservation = await this.reservations.findOneBy({ id: reservationId });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.userId !== request.user.sub && request.user.role !== Role.ADMIN) throw new ForbiddenException();
    return this.tickets.findBy({ reservationId });
  }

  @Get(':id/qr')
  @UseGuards(AuthGuard)
  async qr(@Req() request: { user: AuthenticatedUser }, @Param('id') id: string) {
    const ticket = await this.tickets.findOneBy({ id });
    if (!ticket) throw new NotFoundException('Ticket not found');
    const reservation = await this.reservations.findOneByOrFail({ id: ticket.reservationId });
    if (reservation.userId !== request.user.sub && request.user.role !== Role.ADMIN) throw new ForbiddenException();
    return { ticketId: ticket.id, qrDataUrl: await QRCode.toDataURL(`ticketing://verify/${ticket.token}`, { errorCorrectionLevel: 'H', margin: 2, width: 360 }) };
  }

  @Get('verify/:token')
  async verify(@Param('token') token: string) {
    const qrHash = createHash('sha256').update(token).digest('hex');
    const ticket = await this.tickets.findOneBy({ qrHash });
    return { valid: Boolean(ticket), checkedIn: Boolean(ticket?.checkedInAt), ticket: ticket ? { id: ticket.id, seatId: ticket.seatId, issuedAt: ticket.issuedAt } : undefined };
  }

  @Post(':id/check-in')
  @UseGuards(AuthGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async checkIn(@Param('id') id: string) {
    const ticket = await this.tickets.findOneBy({ id });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.checkedInAt) throw new ForbiddenException('Ticket was already checked in');
    ticket.checkedInAt = new Date();
    return this.tickets.save(ticket);
  }
}

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(@InjectRepository(Notification) private readonly notifications: Repository<Notification>) {}

  @Get()
  list(@Req() request: { user: AuthenticatedUser }) {
    return this.notifications.find({ where: { userId: request.user.sub }, order: { createdAt: 'DESC' }, take: 100 });
  }
}
