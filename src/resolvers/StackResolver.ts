import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Boulder } from "../entity/Boulder";
import { Stack } from "../entity/Stack";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { EventResolver } from "./EventResolver";

@Resolver()
export class StackResolver {
  @Query(() => [Stack])
  getStacks(@Arg("eventId") eventId: string) {
    const stacks = Stack.find({ where: { event: { id: eventId } } });
    return stacks;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createStack(
    @Arg("eventId") eventId: string,
    @Arg("male") male: boolean,
    @Arg("female") female: boolean,
    @Arg("jr") jr: boolean,
    @Arg("a") a: boolean,
    @Arg("b") b: boolean,
    @Arg("c") c: boolean,
    @Arg("d") d: boolean,
    @Ctx() { payload }: MyContext
  ) {
    const eventResolver = new EventResolver();
    const event = await eventResolver.event(eventId);
    if (event === "Event not found.") {
      console.log("event not found");
      return false;
    } else if (event) {
      if (event!.creator.id === payload!.userId) {
        const stack = await Stack.insert({
          event,
          a,
          b,
          c,
          d,
          jr,
          male,
          female,
        });
        if (stack) {
          let i = 1;
          while (i < event.numBoulders + 1) {
            const boulder = await Boulder.insert({
              boulderNumber: i,
              stack: stack.identifiers[0].id,
            });
            await getConnection()
              .createQueryBuilder()
              .relation(Stack, "boulders")
              .of(stack)
              .set(boulder);
            i++;
          }
          if (i === event.numBoulders + 1) {
            return true;
          } else {
            console.log("Could not create all the boulders");
            return false;
          }
        } else {
          console.log("Failed to create stack");
          return false;
        }
      } else {
        console.log("id's did not match");
        return false;
      }
    } else {
      console.log("you should not see me");
      return false;
    }
  }
}
