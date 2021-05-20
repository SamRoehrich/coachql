import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Athlete } from "./Athlete";
import { User } from "./User";
import { Stack } from "./Stack";
import { RunningOrder } from "./RunningOrder";

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

  @Field(() => Int)
  @Column({ nullable: true })
  numBoulders: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @Field(() => [Athlete], { nullable: true })
  @ManyToMany(() => Athlete)
  @JoinTable()
  athletes: Athlete[];

  @Field(() => [Stack], { nullable: true })
  @OneToMany(() => Stack, (stack) => stack.event)
  stacks: Stack[];

  @Field(() => RunningOrder, { nullable: true })
  @OneToOne(() => RunningOrder, (runningOrder) => runningOrder.id)
  @JoinColumn()
  runningOrder: RunningOrder;
}
