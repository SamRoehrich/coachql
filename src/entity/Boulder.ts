import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Stack } from "./Stack";
import { User } from "./User";

@ObjectType()
@Entity("boudlers")
export class Boulder extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  scoreKeeper: User;

  @Field(() => Int)
  @Column()
  boulderNumber: number;

  @Field(() => Stack)
  @ManyToOne(() => Stack, (stack) => stack.id)
  stack: number;
}
