import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { Stack } from "./Stack";
import { User } from "./User";

@ObjectType()
@Entity("athletes")
export class Athlete extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Boolean)
  @Column({ default: false })
  male: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  female: boolean;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => Int)
  @Column()
  birthYear: number;

  @Field()
  @Column()
  team: string;

  @ManyToMany(() => Stack)
  stacks: Stack[];
}
