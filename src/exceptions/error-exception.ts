import { HttpException } from '@nestjs/common';

export class ErrorException {
  handle(error: { message: string; errorCode: number }): HttpException {
    throw new HttpException(
      {
        status: error.errorCode || 500,
        error: error.message,
      },
      error.errorCode || 500,
      {
        cause: error.message,
      },
    );
  }
}
