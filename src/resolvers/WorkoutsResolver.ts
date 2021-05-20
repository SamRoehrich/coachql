import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";

@Resolver()
export class WorkoutResolver {
  @Mutation(() => Boolean)
  async createWorkout(
    @Arg("name") name: string,
    @Arg("restTime") restTime: number,
    @Arg("activeTime") activeTime: number,
    @Arg("sets") sets: number,
    @Arg("reps") reps: number,
    @Arg("description") description: string,
    @Arg("type") type: string,
    @Ctx() { payload }: MyContext
  ) {
    console.log(
      name,
      restTime,
      activeTime,
      sets,
      reps,
      description,
      type,
      payload
    );
    return true;
  }
}
