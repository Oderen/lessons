import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetUserResDto } from '../dto/response/get-user-res.dto';

export function GetUserProfileApi() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'User not found',
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'USER_NOT_FOUND',
          error: 'Not found',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Unexpected error',
      schema: {
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'UNEXPECTED_ERROR',
          error: 'Internat server error',
        },
      },
    }),

    ApiOkResponse({
      description: 'User was successfully found',
      type: GetUserResDto,
    }),
  );
}
