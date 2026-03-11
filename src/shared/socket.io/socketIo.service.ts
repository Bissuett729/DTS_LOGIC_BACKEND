import { Socket, Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: '*:*' })

@Injectable()
export class SocketIOClient implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(SocketIOClient.name);

  @WebSocketServer() webSocketServer: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(): void {
    this.logger.log(`SOCKET IO: Ready to USE`);
  };

  async handleConnection(client: Socket): Promise<void> {
    try {
      const tokenFromUsers = client.handshake.auth.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!tokenFromUsers) {
        this.logger.error(`[Error]: Token not found, connection refused ${client.id} of ${client.handshake.address}`);
        client.disconnect();
        return;
      }

      // Verificar y decodificar el token JWT
      const payload = await this.jwtService.verifyAsync(tokenFromUsers, {
        secret: this.configService.get<string>('jwt.JWT_SEED'),
      });

      // Extraer el userId del payload (sub es el userId)
      const userId = payload.sub;
      if (!userId) {
        this.logger.error(`[Error]: UserId not found in token, connection refused ${client.id}`);
        client.disconnect();
        return;
      }

      // Unir al cliente a su sala personal
      const userRoom = this.getUserRoom(userId);
      await client.join(userRoom);

      // Almacenar el userId en el socket para referencia futura
      client.data.userId = userId;

      this.logger.log(`Socket CONN established... ${client.id} - User: ${userId} joined room: ${userRoom}`);
    } catch (error) {
      this.logger.error(`[Error]: Failed to authenticate socket connection ${client.id}: ${error.message}`);
      client.disconnect();
    }
  };

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.data.userId;
    this.logger.log(`Client disconnected: ${client.id}${userId ? ` - User: ${userId}` : ''}`);
  };

  public async emitEvent(event: string, payload: any): Promise<void> {
    this.logger.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED --> ${event} %%%%%%%%%%%% |---------------`);
    this.webSocketServer.emit(event, payload);
  };

  public async emitEventTo(socketID: string, event: string, payload: any): Promise<void> {
    this.logger.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED FOR ${socketID} --> ${event} %%%%%%%%%%%% |---------------`);
    this.webSocketServer.to(socketID).emit(event, payload);
  };

  public async emitEventRoom(room: string, event: string, payload: any): Promise<void> {
    this.logger.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED TO ROOM ${room} --> ${event} %%%%%%%%%%%% |---------------`);
    this.webSocketServer.to(room).emit(event, payload);
  };

  public async disconnectClient(socketID: string): Promise<void> {
    const client = this.webSocketServer.sockets.sockets.get(socketID);
    if (client) {
      client.disconnect();
      this.logger.log(`Client disconnected: ${client.id}`);
    } else {
      this.logger.error(`Error: Client not found with socketID ${socketID}`);
    }
  }

  /**
   * Genera el nombre de la sala para un usuario específico
   * @param userId ID del usuario
   * @returns Nombre de la sala
   */
  private getUserRoom(userId: string): string {
    return `user:${userId}`;
  }
}
