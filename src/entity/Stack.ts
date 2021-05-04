import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Athlete } from "./Athlete";
import { Boulder } from "./Boulder";
import { Event } from "./Event";

@ObjectType()
@Entity("stacks")
export class Stack extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  male: boolean;

  @Field()
  @Column()
  female: boolean;

  @Field()
  @Column()
  jr: boolean;

  @Field()
  @Column()
  a: boolean;

  @Field()
  @Column()
  b: boolean;

  @Field()
  @Column()
  c: boolean;

  @Field()
  @Column()
  d: boolean;

  @ManyToOne(() => Event, (hostEvent) => hostEvent.id)
  @Field(() => Event)
  event: Event;

  @ManyToMany(() => Athlete, (athlete) => athlete.id)
  @Field(() => [Athlete])
  @JoinTable()
  athletes: Athlete[];

  @ManyToOne(() => Boulder, (boulder) => boulder.id)
  @Field(() => [Boulder])
  boulders: Boulder[];
}
