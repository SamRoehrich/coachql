import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from "typeorm";
import { Organization } from "./Organization";

@ObjectType()
@Entity("trainingPlans")
export class TrainingPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @ManyToOne(() => Organization)
  org: Organization;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ type: "date" })
  startDate: string;

  @Field()
  @Column({ type: "date" })
  endDate: string;

  @Field(() => Int)
  @Column()
  numWeeks: number;

  @Field()
  @Column({
    type: "jsonb",
    array: true,
    default: () => "ARRAY[]::jsonb[]",
  })
  plan: string;
}
