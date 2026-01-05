import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelloWorldResolver } from './hello-world/hello-world.resolver';
import { HelloWorldService } from './hello-world/hello-world.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // enable graphql-ws. onConnect is a good place to log/validate connectionParams (auth)
      subscriptions: {
        'graphql-ws': {
          onConnect: (ctx) => {
            console.log(
              'WS onConnect connectionParams:',
              (ctx as any).connectionParams,
            );
            return true;
          },
          onDisconnect: () => console.log('WS onDisconnect'),
        },
      },
      // other options...
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloWorldResolver, HelloWorldService],
})
export class AppModule {}
