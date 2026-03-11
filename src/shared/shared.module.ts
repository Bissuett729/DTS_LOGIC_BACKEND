import { Module } from '@nestjs/common';
import { WinstonModule } from './Wiston';
import { TCPModule } from './microservices';
import { SocketModule } from './socket.io/socket.module';
import { LockModule } from './lockModule/lockModule.module';

@Module({
    imports: [
        TCPModule,
        WinstonModule,
        SocketModule,
        LockModule,
    ],
    exports: [
        TCPModule,
        WinstonModule,
        SocketModule,
        LockModule,
    ]
})
export class SharedModule { }