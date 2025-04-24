import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseInterface } from '../dto/api-response.interface';

interface EventContext {
  pattern: string;
}

interface ErrorObject {
  message?: string;
}

@Catch(RpcException)
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const args = host.getArgs();
    const context = args[1] as EventContext;
    const pattern = context?.pattern ?? 'unknown-event';

    const errorResponse = exception.getError();
    let message: string = '';
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      typeof errorResponse === 'object' &&
      'message' in errorResponse &&
      errorResponse.message !== null
    ) {
      message =
        (errorResponse as ErrorObject)?.message ?? 'An unknown error occurred';
    } else {
      message = 'An unknown error occurred';
    }
    const formattedError: ApiResponseInterface<any> = {
      event: pattern,
      status: 'error',
      message: message,
      data: null,
    };
    return of(formattedError);
  }
}
