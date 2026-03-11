import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongooseConnectionHandler } from '../connection';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private readonly config: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions {
        return {
            uri: this.config.get<string>('mongoose.DB_URI'),
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            onConnectionCreate: MongooseConnectionHandler.handle,
        };
    }
}