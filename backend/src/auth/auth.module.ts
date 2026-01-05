import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'devSecret',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
