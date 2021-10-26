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
@Entity("assessments")
export class Assessment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Organization)
  @ManyToOne(() => Organization)
  organization: Organization;

  @Field()
  @Column()
  dataPoints: string;

  @Field()
  @Column()
  testMethod: string;

  @Field()
  @Column({ nullable: true })
  assessmentType: string;
}
