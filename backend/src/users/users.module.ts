import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'devSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
