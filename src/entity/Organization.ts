import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Athlete } from "./Athlete";
import { Coach } from "./Coach";
import { User } from "./User";
import { Workout } from "./Workout";
import { Team } from "./Team";

@ObjectType()
@Entity("organizations")
export class Organization extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Field(() => [Team])
  @OneToMany(() => Team, (Team) => Team.id)
  teams: Team[];

  @Field(() => [Workout])
  @OneToMany(() => Workout, (workout) => workout.id)
  workouts: Workout[];

  @Field(() => [Athlete])
  @OneToMany(() => Athlete, (athlete) => athlete.id)
  athletes: Athlete[];

  @Field(() => [Coach])
  @OneToMany(() => Coach, (coach) => coach.id)
  coaches: Coach[];
}
