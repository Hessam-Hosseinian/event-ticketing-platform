import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? '*' } })
export class UpdatesGateway {
  @WebSocketServer() server?: Server;

  emit(name: string, data: unknown): void {
    this.server?.emit(name, data);
  }

  emitEvent(eventId: string, name: string, data: unknown): void {
    this.server?.to(`event:${eventId}`).emit(name, data);
  }

  handleConnection(socket: { on: (event: string, listener: (eventId: string) => void) => void; join: (room: string) => void }): void {
    socket.on('event.subscribe', (eventId) => socket.join(`event:${eventId}`));
  }
}
