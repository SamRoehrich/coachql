import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Athlete } from "./Athlete";
import { Boulder } from "./Boulder";
import { Event } from "./Event";

export enum Gender {
  Male = "male",
  Female = "female",
}

export enum Catagory {
  JR = "jr",
  A = "a",
  B = "b",
  C = "c",
  D = "d",
}

export type GroupType = {
  id: number;
  gender: Gender;
  catagory: Catagory;
};

export const InitialStacks: GroupType[] = [
  {
    id: 0,
    gender: Gender.Male,
    catagory: Catagory.JR,
  },
  {
    id: 1,
    gender: Gender.Male,
    catagory: Catagory.A,
  },
  {
    id: 2,
    gender: Gender.Male,
    catagory: Catagory.B,
  },
  {
    id: 3,
    gender: Gender.Male,
    catagory: Catagory.C,
  },
  {
    id: 4,
    gender: Gender.Male,
    catagory: Catagory.D,
  },
  {
    id: 5,
    gender: Gender.Female,
    catagory: Catagory.JR,
  },
  {
    id: 6,
    gender: Gender.Female,
    catagory: Catagory.A,
  },
  {
    id: 7,
    gender: Gender.Female,
    catagory: Catagory.B,
  },
  {
    id: 8,
    gender: Gender.Female,
    catagory: Catagory.C,
  },
  {
    id: 9,
    gender: Gender.Female,
    catagory: Catagory.D,
  },
];

registerEnumType(Gender, {
  name: "Gender",
  description: "Athlete Gender",
});

registerEnumType(Catagory, {
  name: "Catagory",
  description: "Age Catagory",
});

@ObjectType()
@Entity("stacks")
export class Stack extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Gender)
  @Column()
  gender: Gender;

  @Field(() => Catagory)
  @Column()
  catagory: Catagory;

  @ManyToOne(() => Event, (hostEvent) => hostEvent.id)
  @Field(() => Event)
  event: Event;

  @ManyToMany(() => Athlete, (athlete) => athlete.id)
  @Field(() => [Athlete])
  @JoinTable()
  athletes: Athlete[];

  @ManyToOne(() => Boulder, (boulder) => boulder.id)
  @Field(() => [Boulder])
  boulders: Boulder[];
}
