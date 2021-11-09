import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Assessment } from "./Assessment";
import { Athlete } from "./Athlete";

@ObjectType()
@Entity("records")
export class Record extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  data: string;

  @Field(() => Assessment)
  @ManyToOne(() => Assessment, (assessment) => assessment.id)
  assessment: Assessment;

  @Field(() => Athlete)
  @ManyToOne(() => Athlete, (athlete) => athlete.id)
  athlete: Athlete;

  @Field(() => String)
  @Column()
  date: string;
}
