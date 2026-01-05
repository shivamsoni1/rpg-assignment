import {
  Resolver,
  Mutation,
  Args,
  Query,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostEntity } from './post.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { pubSub } from '../pubsub';

interface GqlContext {
  req: {
    user?: {
      id: number;
    };
  };
}

interface PostAddedPayload {
  postAdded: PostEntity;
}

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query(() => [PostEntity])
  async posts() {
    return this.postsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostEntity)
  async createPost(
    @Args('content') content: string,
    @Context() ctx: GqlContext,
  ) {
    const user = ctx.req.user;
    if (!user || typeof user.id !== 'number') {
      throw new UnauthorizedException();
    }
    return this.postsService.create(content, user.id);
  }

  @Subscription(() => PostEntity, { resolve: (p) => p.postAdded ?? p })
  postAdded() {
    console.log('Subscription iterator created at', new Date().toISOString());
    return pubSub.asyncIterator<PostEntity>('postAdded');
  }
}
