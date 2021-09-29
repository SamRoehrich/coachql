import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Workout } from "./Workout";

@ObjectType()
@Entity("sessions")
export class Session extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, (workout) => workout.id)
  @Field(() => Workout)
  workout: Workout;

  @Field()
  @Column()
  notes: string;

  @Field(() => Int)
  @Column()
  rpe: number;

  @Field(() => Int)
  @Column()
  percentCompleted: number;

  @Field()
  @Column()
  date: string;
}
