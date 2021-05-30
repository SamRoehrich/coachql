import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Team } from "./Team";

@ObjectType()
@Entity("workouts")
export class Workout extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  sets: number;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  workoutType: string;

  @Field(() => String)
  @Column()
  timerType: string;

  @Field(() => String)
  @Column()
  intervals: string;

  @Field(() => String)
  @Column()
  equiptment: string;

  @Field(() => Team)
  @ManyToOne(() => Team, (team) => team.id)
  team: Team;
}
