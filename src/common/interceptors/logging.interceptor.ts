import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WinstonService } from 'src/shared/Wiston/winston.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`[Interceptor] ${method} ${url} - ${responseTime}ms - IP: ${ip} - UserAgent: ${userAgent}`);
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const errorResponse = error.getResponse();
          this.logger.warn(
            `[Interceptor] ${method} ${url} - ${status} - ${responseTime}ms - Error: ${JSON.stringify(errorResponse)}`,
          );
        } else {
          this.logger.error(
            `[Interceptor] ${method} ${url} - 500 - ${responseTime}ms - Error: ${error.message} - Stack: ${error.stack}`,
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
