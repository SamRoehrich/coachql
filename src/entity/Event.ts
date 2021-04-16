import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Athlete } from "./Athlete";
import { Boulder } from "./Boulder";
import { User } from "./User";
import { Stack } from "./Stack";

@ObjectType()
@Entity("events")
export class Event extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({})
  name: string;

  @Field()
  @Column()
  location: string;

  @Field()
  @Column()
  visible: boolean;

  @Field()
  @Column({})
  startDate: string;

  @Field()
  @Column({ default: false })
  started: boolean;

  @Field(() => User)
  @ManyToMany(() => User)
  @JoinTable()
  creator: User;

  @Field(() => [Athlete], { nullable: true })
  @ManyToMany(() => Athlete)
  @JoinTable()
  athletes: Athlete[];

  @Field(() => [Boulder])
  boulders: Boulder[];

  @Field(() => [Stack], { nullable: true })
  stacks: Stack[];
}
