import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { NotFoundError } from '../types/NotFoundError';
import { isPrismaError } from '../utils/is-prisma-error.util';
import { handleDatabaseErrors } from '../utils/handle-database-error.utils';
import { DatabaseError } from '../types/DatabaseError';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (isPrismaError(error)) {
          error = handleDatabaseErrors(error);
        }
        if (error instanceof DatabaseError) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
