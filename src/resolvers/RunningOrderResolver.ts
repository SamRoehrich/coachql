import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Event } from "../entity/Event";
// import { Group } from "../entity/Group";
import { RunningOrder } from "../entity/RunningOrder";
import { InitialStacks, Stack } from "../entity/Stack";

@Resolver()
export class RunningOrderResolver {
  @Mutation(() => Boolean)
  async createRunningOrder(@Arg("eventId") eventId: string) {
    console.log(eventId);
    const qb = getConnection().createQueryBuilder();
    const unordered = await qb
      .insert()
      .into(Stack)
      .values(InitialStacks)
      .execute();
    // attach event to stack
    for (let stack of unordered.identifiers) {
      await qb.relation(Stack, "event").of(stack).set(eventId);
    }
    //add stacks to running order
    const ro = await qb
      .insert()
      .into(RunningOrder)
      .values({ unordered: unordered.identifiers })
      .execute();

    await qb
      .relation(Event, "runningOrder")
      .of(eventId)
      .set(ro.identifiers[0].id);
    return true;
  }

  @Mutation(() => Boolean)
  async editRunningOrder(
    @Arg("runningOrderId") runningOrderId: string,
    @Arg("unordered", () => [Int]) unordered: Number[],
    @Arg("first", () => [Int]) first: Number[],
    @Arg("second", () => [Int]) second: Number[],
    @Arg("third", () => [Int]) third: Number[]
  ) {
    console.log(first, second, third, unordered, runningOrderId);
    return true;
  }
  @Mutation(() => Boolean)
  async resetRunningOrder(
    @Arg("eventId") eventId: string,
    @Arg("roId") roId: string
  ) {
    const qb = getConnection().createQueryBuilder();
    const stacks = await Stack.find({
      where: {
        event: eventId,
      },
    });
    const ro = await RunningOrder.findOne({ where: { id: roId } });
    if (stacks && ro) {
      qb.update(RunningOrder)
        .set({
          unordered: stacks,
          first: [],
          second: [],
          third: [],
        })
        .where("id = :id", { id: roId })
        .execute();
      return true;
    }
    return false;
  }

  @Query(() => RunningOrder)
  async getRunningOrder(@Arg("eventId") eventId: string) {
    const qb = getConnection().createQueryBuilder();
    let ro = await qb.relation(Event, "runningOrder").of(eventId).loadOne();
    if (ro) {
      for (let i = 0; i < ro.unordered.length; i++) {
        const stack = await getConnection()
          .createQueryBuilder()
          .where("stack.id = :stackId", { stackId: ro.unordered[i].id })
          .getOne();
        ro.unordered[i] = stack;
      }
      return ro;
    }
    return null;
  }
}
