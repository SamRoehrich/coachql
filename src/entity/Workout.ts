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

  @Field(() => Int)
  @Column()
  reps: number;

  // in seconds
  @Field(() => Int)
  @Column()
  activeTime: number;

  // in seconds
  @Field(() => Int)
  @Column()
  restTime: number;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  type: string;

  @Field(() => Team)
  @ManyToOne(() => Team, (team) => team.id)
  team: Team;
}
