import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfigService } from './config';
import { MongooseSchemas } from './providers';

import * as query from './queries'
import * as token from '../../../../Application/tokens'

const sharedProviders = [
    { provide: token.DOWN_TIME_REPO,  useClass: query.DownTimeQuery },
    { provide: token.DEPARTMENT_REPO, useClass: query.DepartmentQuery },
    { provide: token.LINE_REPO,       useClass: query.LineQuery },
];

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MongooseConfigService,
        }),
        MongooseModule.forFeature(MongooseSchemas),
    ],
    providers: [...sharedProviders],
    exports: [MongooseModule, ...sharedProviders],
})
export class DatabaseModule { }