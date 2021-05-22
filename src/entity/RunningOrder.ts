import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Stack } from "./Stack";

@ObjectType()
@Entity("runningOrder")
export class RunningOrder extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Stack])
  @Column({ array: false, type: "jsonb", default: () => "'[]'" })
  unordered: Number[];

  @Field(() => [Stack])
  @Column({ array: false, type: "jsonb", default: () => "'[]'" })
  first: Number[];

  @Field(() => [Stack])
  @Column({ array: false, type: "jsonb", default: () => "'[]'" })
  second: Number[];

  @Field(() => [Stack])
  @Column({ array: false, type: "jsonb", default: () => "'[]'" })
  third: Number[];
}
