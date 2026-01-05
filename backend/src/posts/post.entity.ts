import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserEntity } from '../users/user.entity';

@ObjectType()
@Entity('posts')
export class PostEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  content: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column()
  authorId: number;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
