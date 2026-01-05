import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserEntity)
  user: UserEntity;
}

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserEntity)
  async register(@Args('input') input: CreateUserInput) {
    const user = await this.usersService.register(
      input.username,
      input.email,
      input.password,
    );
    return user;
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return this.usersService.login(input.email, input.password);
  }
}
