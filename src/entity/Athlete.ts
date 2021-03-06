import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Gender } from "./Stack";
import { User } from "./User";
import { Organization } from "./Organization";
import { Team } from "./Team";
import { TrainingPlan } from "./TrainingPlan";
import { Session } from "./Session";

@ObjectType()
@Entity("athletes")
export class Athlete extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Gender)
  @Column({ nullable: true, default: null })
  gender: Gender;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  parentEmail: string;

  @Field(() => Int)
  @Column({ nullable: true, default: null })
  birthYear: number;

  @Field()
  @ManyToOne(() => Organization)
  organization: Organization;

  @Field()
  @ManyToOne(() => Team, { nullable: true })
  team: Team;

  @Field()
  @Column({ nullable: true })
  metricsRequired: boolean;

  @Field()
  @Column({ nullable: true })
  createWorkouts: boolean;

  // group

  @Field()
  @ManyToOne(() => TrainingPlan)
  trainingPlan: TrainingPlan;

  @Field(() => [Session])
  @ManyToMany(() => Session)
  @JoinTable()
  sessions: Session[];
}
