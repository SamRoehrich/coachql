import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./Organization";

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
  numSets: number;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  workoutType: string;

  @Field()
  @Column()
  sets: string;

  @Field(() => String)
  @Column()
  equiptment: string;

  @Field(() => Organization)
  @ManyToOne(() => Organization, (organization) => organization.id)
  organization: Organization;

  @Field(() => Boolean)
  @Column({ default: false, nullable: true })
  recordClimbs: boolean;

  @Field(() => Boolean)
  @Column({ default: false, nullable: true })
  notifications: boolean;
}
