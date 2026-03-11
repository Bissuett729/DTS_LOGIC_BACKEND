import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { requestContext } from '../context/request-context';
import { WinstonService } from 'src/shared/Wiston/winston.service';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
    constructor(private readonly logger: WinstonService) {}

    use(req: any, res: any, next: () => void) {
        const traceId = req.headers['x-trace-id'] ?? uuidv4();
        const startTime = Date.now();

        this.logger.log(`[Request] ${req.method} ${req.originalUrl} - TraceID: ${traceId}`);

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const statusCode = res.statusCode;
            const logMessage = `[Response] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - TraceID: ${traceId}`;
            
            if (statusCode >= 400) {
                this.logger.error(logMessage);
            } else {
                this.logger.log(logMessage);
            }
        });

        requestContext.run(
            {
                traceId: traceId,
                userId: req.user?.id,
                method: req.method,
                path: req.originalUrl,
            },
            () => next(),
        );
    }
}