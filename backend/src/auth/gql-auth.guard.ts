// ...existing code...
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

// AuthGuard is a factory; cast the call result to a class constructor type.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const JwtAuthGuard = AuthGuard('jwt') as unknown as new (...args: any[]) => any;

@Injectable()
export class GqlAuthGuard extends JwtAuthGuard {
  getRequest(context: ExecutionContext): Request {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext<{ req?: Request } | undefined>();
    const req = ctx?.req ?? context.switchToHttp().getRequest<Request>();

    // DEBUG: log authorization header for this request
    // remove after debugging

    console.log(
      'DBG Authorization header:',
      req.headers?.authorization ?? '[none]',
    );

    return req;
  }
}
// ...existing code...
