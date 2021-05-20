import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Athlete } from "./Athlete";
import { User } from "./User";
import { Workout } from "./Workout";

@ObjectType()
@Entity("teams")
export class Team extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  headCoach: User;

  @Field()
  @Column()
  teamName: string;

  @Field(() => [Athlete])
  @ManyToMany(() => Athlete)
  @JoinTable()
  athletes: Athlete[];

  @Field(() => [Workout])
  @OneToMany(() => Workout, (workout) => workout.id)
  workouts: Workout[];
}
