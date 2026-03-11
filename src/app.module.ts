import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// CONFIG
require('dotenv').config();

// Middleware
import { TraceMiddleware } from './common/middleware/trace.middleware';

// ENV VALIDATION
import { validate } from './env.validation';

// CONFIGURATIONS
import { httpConfig, jwtConfig, microserviceConfig, mongooseConfig } from './configuration';

// COMMON SERVICES
import { AppConfigService } from './common/config/app-config.service';

// MODULES
import * as apps from './apps';
import { WinstonModule } from './shared/Wiston/winston.module';

// ADAPTERS
import { OsAdapter } from './common/Os/os.adapter';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            envFilePath: [`env/${process.env.NODE_ENV}.env`, '.env'],
            load: [
                httpConfig,
                jwtConfig,
                microserviceConfig,
                mongooseConfig
            ],
            isGlobal: true,
            expandVariables: true,
        }),

        HttpModule,
        WinstonModule,

        apps.DTSModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        OsAdapter,
        AppConfigService,
    ],
    exports: [
        AppConfigService, // Exportar para que esté disponible en otros módulos
    ],
})
export class AppModule implements NestModule {

    static serverIP: string = 'localhost';

    constructor(private readonly osAdapter: OsAdapter) {
        AppModule.serverIP = this.osAdapter.getServerIp() || 'localhost';
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TraceMiddleware)
            .forRoutes('*');
    }
}