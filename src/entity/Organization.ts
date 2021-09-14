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
import { User } from "./User";
import { Workout } from "./Workout";

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

  @Field(() => [Workout])
  @OneToMany(() => Workout, (workout) => workout.id)
  workouts: Workout[];
}
