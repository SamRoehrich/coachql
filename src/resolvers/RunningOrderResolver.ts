import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection, getManager } from "typeorm";
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
    @Arg("unordered", () => [Int]) unordered: Number[],
    @Arg("first", () => [Int]) first: Number[],
    @Arg("second", () => [Int]) second: Number[],
    @Arg("third", () => [Int]) third: Number[],
    @Arg("runningOrderId") runningOrderId: string
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(RunningOrder)
      .set({
        unordered,
        first,
        second,
        third,
      })
      .where("id = :id", { id: runningOrderId })
      .execute();
    console.log(updateRes);
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
          unordered: stacks as any[],
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
      const unorderedStack: Stack[] = [];
      const firstStack: Stack[] = [];
      const secondStack: Stack[] = [];
      const thirdStack: Stack[] = [];

      console.log(ro);
      if (ro.unordered.length > 0) {
        for (let i = 0; i < ro.unordered.length; i++) {
          let stack = await getManager()
            .createQueryBuilder(Stack, "stacks")
            .where("stacks.id = :stackId", { stackId: ro.unordered[i] })
            .getOne();
          if (stack) unorderedStack[i] = stack;
        }
      }
      if (ro.first.length > 0) {
        for (let i = 0; i < ro.first.length; i++) {
          let stack = await getManager()
            .createQueryBuilder(Stack, "stacks")
            .where("stacks.id = :stackId", { stackId: ro.first[i] })
            .getOne();
          if (stack) firstStack[i] = stack;
        }
      }
      if (ro.second.length > 0) {
        for (let i = 0; i < ro.second.length; i++) {
          let stack = await getManager()
            .createQueryBuilder(Stack, "stacks")
            .where("stacks.id = :stackId", { stackId: ro.second[i] })
            .getOne();
          if (stack) secondStack[i] = stack;
        }
      }
      if (ro.third.length > 0) {
        for (let i = 0; i < ro.third.length; i++) {
          let stack = await getManager()
            .createQueryBuilder(Stack, "stacks")
            .where("stacks.id = :stackId", { stackId: ro.third[i] })
            .getOne();
          if (stack) thirdStack[i] = stack;
        }
      }

      const res = {
        ...ro,
        unordered: unorderedStack,
        first: firstStack,
        second: secondStack,
        third: thirdStack,
      };
      return res;
    }
    return null;
  }
}
