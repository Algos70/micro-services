import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseInterface } from './dto/api-response.interface';

@Catch(RpcException)
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const errorResponse = exception.getError();
    let message: string = '';
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      typeof errorResponse === 'object' &&
      'message' in errorResponse &&
      errorResponse.message !== null
    ) {
      message = (errorResponse as any).message;
    } else {
      message = 'An unknown error occurred';
    }
    const formattedError: ApiResponseInterface<any> = {
      status: 'error',
      message: message,
      data: null,
    };
    return of(formattedError);
  }
}
