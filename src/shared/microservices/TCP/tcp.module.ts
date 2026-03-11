import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { availableMsClients } from './client.data';
import { TcpClientsService } from './tcpMicroservice.service';

@Module({
  imports: [
    ConfigModule, 
    ClientsModule.registerAsync([
      {
        name: availableMsClients.user,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('microservice.USER_MICROSERVICE_HOST'),
            port: configService.get<number>('microservice.USER_MICROSERVICE_PORT'),
          },
        }),
      },
      {
        name: availableMsClients.websocat,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('microservice.WEBSOCAT_MICROSERVICE_HOST'),
            port: configService.get<number>('microservice.WEBSOCAT_MICROSERVICE_PORT'),
          },
        }),
      },
    ]),
  ],
  providers: [
    TcpClientsService
  ],
  exports: [
    TcpClientsService
  ], 
})
export class TCPModule {}
