import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";

@ObjectType()
@Entity("runningOrder")
export class RunningOrder extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Group)
  @Column({ array: false, type: "jsonb", default: () => "'[]'" })
  groups: Group[];
}
