import { Logger } from '@nestjs/common';
import { Connection } from 'mongoose';

export class MongooseConnectionHandler {
  private static readonly logger = new Logger(MongooseConnectionHandler.name);

  static handle(connection: Connection): Connection {
    connection.on('connected', () => {
      MongooseConnectionHandler.logger.log('Conexión a MongoDB establecida con éxito');
    });

    connection.on('error', (err) => {
      MongooseConnectionHandler.logger.error('Error de conexión a MongoDB', err.stack);
    });

    connection.on('disconnected', () => {
      MongooseConnectionHandler.logger.warn('Desconexión de MongoDB');
    });

    return connection;
  }
}