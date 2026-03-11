import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, ConflictException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class getParamInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const request = context.switchToHttp().getRequest();
      function validateDate(fechaString) {
        const fecha = new Date(fechaString);
        if (isNaN(fecha.getTime())) return null;
        return fecha;
      }

      request.params._order = request.params._order === 'true' ? true : request.params._order === 'false' ? false : null;
      request.params._page = request.params._page != '_' ? parseInt(request.params._page, 10) : null;
      request.params._pageSize = request.params._pageSize != '_' ? parseInt(request.params._pageSize, 10) : null;
      request.params._active = request.params._active === 'true' ? true : request.params._active === 'false' ? false : null;

      request.params._rangeStartDate = validateDate(request.params._rangeStartDate) ? new Date(request.params._rangeStartDate) : null
      request.params._rangeFinishDate = validateDate(request.params._rangeFinishDate) ? new Date(request.params._rangeFinishDate) : null

      if (request.params._page < 0) request.params._page = 0;
      if (request.params._pageSize < 0) request.params._pageSize = 0;
      return next.handle();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
