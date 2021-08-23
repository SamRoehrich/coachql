import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Gender } from "./Stack";
import { User } from "./User";
import { Organization } from "./Organization";
import { Team } from "./Team";
import { TrainingPlan } from "./TrainingPlan";

@ObjectType()
@Entity("athletes")
export class Athlete extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Gender)
  @Column()
  gender: Gender;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => Int)
  @Column()
  birthYear: number;

  @Field()
  @ManyToOne(() => Organization)
  organization: Organization

  @Field()
  @ManyToOne(() => Team, { nullable: true})
  team: Team

  // group

  @Field()
  @ManyToOne(() => TrainingPlan)
  trainingPlan: TrainingPlan
}
