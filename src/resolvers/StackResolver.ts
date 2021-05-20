import { Arg, Field, InputType, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Stack, Gender, Catagory } from "../entity/Stack";

@InputType()
export class MinimalStack {
  @Field(() => Gender)
  gender: Gender;

  @Field(() => Catagory)
  catagory: Catagory;
}

@Resolver()
export class StackResolver {
  @Query(() => [Stack])
  async getStacks(@Arg("eventId") eventId: string) {
    const stacks = await Stack.find({ where: { event: { id: eventId } } });
    if (stacks) {
      const event = await getConnection()
        .createQueryBuilder()
        .relation(Stack, "event")
        .of(stacks)
        .loadOne();
      for (let stack of stacks) {
        stack.boulders = await getConnection()
          .createQueryBuilder()
          .relation(Stack, "boulders")
          .of(stack)
          .loadMany();
        stack.event = event;
      }
      return stacks;
    }
    return null;
  }

  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async createStack(
  //   @Arg("eventId") eventId: string,
  //   @Arg("gender", () => Gender) gender: Gender,
  //   @Arg("catagory", () => Catagory) catagory: Catagory,
  //   @Ctx() { payload }: MyContext
  // ) {
  //   const eventResolver = new EventResolver();
  //   const event = await eventResolver.event(eventId);
  //   if (event === null) {
  //     console.log("event not found");
  //     return false;
  //   } else if (event) {
  //     if (event!.creator.id === payload!.userId) {
  //       const stack = await Stack.insert({
  //         event!,
  //         gender,
  //         catagory,
  //       });
  //       if (stack) {
  //         let i = 1;
  //         while (i < event.numBoulders + 1) {
  //           const boulder = await Boulder.insert({
  //             boulderNumber: i,
  //             stack: stack.identifiers[0].id,
  //           });
  //           await getConnection()
  //             .createQueryBuilder()
  //             .relation(Stack, "boulders")
  //             .of(stack)
  //             .set(boulder);
  //           i++;
  //         }
  //         if (i === event.numBoulders + 1) {
  //           return true;
  //         } else {
  //           console.log("Could not create all the boulders");
  //           return false;
  //           5;
  //         }
  //       } else {
  //         console.log("Failed to create stack");
  //         return false;
  //       }
  //     } else {
  //       console.log(
  //         "You do not have access to this function. ERR: Create Stack"
  //       );
  //       return false;
  //     }
  //   } else {
  //     console.log("you should not see me");
  //     return false;
  //   }
  // }
}
