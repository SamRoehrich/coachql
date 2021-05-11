import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";
import { Stack } from "./Stack";

@ObjectType()
@Entity("groups")
export class Group extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Event)
  @OneToOne(() => Event, (event) => event.id)
  @JoinColumn()
  event: Event;

  @Field()
  @Column()
  title: string;

  @Field(() => [Stack])
  @Column({ array: false, type: "jsonb", default: () => "'[]'" })
  stacks: Stack[];
}
