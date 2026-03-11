import { Global, Module } from '@nestjs/common';
import { SocketIOClient } from './socketIo.service';
import { SocketNotificationService } from './socket-notification.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.JWT_SEED'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [SocketIOClient, SocketNotificationService],
    exports: [SocketIOClient, SocketNotificationService]
})
export class SocketModule { }
