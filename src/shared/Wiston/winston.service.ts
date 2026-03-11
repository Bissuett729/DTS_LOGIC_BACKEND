import { Injectable } from '@nestjs/common';
import { format, createLogger, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';
import { traceFormat } from './trace.format';

@Injectable()
export class WinstonService {

    private loggerInfo: Logger;
    private loggerError: Logger;
    private loggerWarn: Logger;
    private loggerAll: Logger;

    constructor() {
        this.createLoggers();
    }

    private createLoggers(): void {

        const dateFormat = format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        });

        const textFormat = format.printf((log) => {
            return `${log.timestamp}-[${log.level.toUpperCase().charAt(0)}]` +
                ` [${log.traceId ?? 'N/A'}] ${log.message}`;
        });

        const baseFormat = format.combine(
            traceFormat(),
            dateFormat,
            textFormat,
        );

        this.loggerInfo = createLogger({
            level: 'info',
            format: baseFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/info/info-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '5d',
                    zippedArchive: true,
                }),
            ],
        });

        this.loggerError = createLogger({
            level: 'error',
            format: baseFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/error/error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '5d',
                    zippedArchive: true,
                }),
            ],
        });

        this.loggerWarn = createLogger({
            level: 'warn',
            format: baseFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/warn/warn-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '5d',
                    zippedArchive: true,
                }),
            ],
        });

        this.loggerAll = createLogger({
            format: baseFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/all/all-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '5d',
                    zippedArchive: true,
                }),
                new transports.Console(),
            ],
        });
    }

    log(message: string) {
        this.loggerInfo.info(message);
        this.loggerAll.info(message);
    }

    error(message: string) {
        this.loggerError.error(message);
        this.loggerAll.error(message);
    }

    warn(message: string) {
        this.loggerWarn.warn(message);
        this.loggerAll.warn(message);
    }
}