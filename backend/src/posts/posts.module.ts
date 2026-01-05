import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UsersModule],
  providers: [PostsService, PostsResolver],
})
export class PostsModule {}
