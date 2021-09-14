import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Athlete } from "./Athlete";
import { Organization } from "./Organization";

@ObjectType()
@Entity("teams")
export class Team extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field(() => User)
  // @OneToOne(() => User)
  // @JoinColumn()
  // headCoach: User;

  @Field()
  @Column()
  teamName: string;

  @Field(() => [Athlete])
  @ManyToMany(() => Athlete)
  @JoinTable()
  athletes: Athlete[];

  @Field(() => Organization)
  @ManyToOne(() => Organization)
  @JoinTable()
  organization: Organization;
}
