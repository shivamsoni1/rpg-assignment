// ...existing code...
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import type { Request } from 'express';

// PassportStrategy is a factory; keep the cast to avoid the unsafe-call lint for the factory itself.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const BaseJwtStrategy = PassportStrategy(Strategy as unknown as any) as new (
  ...args: any[]
) => any;

@Injectable()
export class JwtStrategy extends BaseJwtStrategy {
  constructor(private usersService: UsersService) {
    super({
      // use a typed manual extractor instead of ExtractJwt.fromAuthHeaderAsBearerToken()
      jwtFromRequest: (req?: Request): string | null => {
        if (!req) return null;
        const authHeader = (req.headers as Record<string, string | undefined>)[
          'authorization'
        ];
        if (!authHeader) return null;
        const [scheme, token] = authHeader.split(' ');
        return scheme === 'Bearer' && token ? token : null;
      },
      secretOrKey: process.env.JWT_SECRET ?? 'devSecret',
    });
  }

  async validate(payload: {
    sub: number;
    email?: string;
  }): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) return null;

    const safeUser: Omit<UserEntity, 'password'> = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    return safeUser;
  }
}
// ...existing code...
