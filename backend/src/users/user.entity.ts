import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('users')
export class UserEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  // do NOT expose password via GraphQL (no @Field decorator)
  @Column()
  password: string;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
