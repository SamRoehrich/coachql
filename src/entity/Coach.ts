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
import { User } from "./User";
import { Organization } from "./Organization";
import { Team } from "./Team";

@ObjectType()
@Entity("coaches")
export class Coach extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User, { nullable: true, defaultValue: null })
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => Int)
  @Column()
  birthYear: number;

  @Field(() => Organization)
  @ManyToOne(() => Organization)
  organization: Organization;

  @Field()
  @ManyToOne(() => Team, { nullable: true })
  team: Team;
}
