import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Workout } from "../entity/Workout";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { Organization } from "../entity/Organization";
import { getConnection, getRepository } from "typeorm";

export interface Interval {
  minutes: number;
  seconds: number;
  description: string;
  type: string;
  infinite: boolean;
}
@Resolver(() => Workout)
export class WorkoutResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createWorkout(
    @Arg("name") name: string,
    @Arg("sets") sets: string,
    @Arg("description") description: string,
    @Arg("workoutType") workoutType: string,
    @Arg("equiptment") equiptment: string,
    @Arg("numSets") numSets: number,
    @Ctx() { payload }: MyContext
  ) {
    const organization = await Organization.findOne({
      owner: { id: payload?.userId },
    });
    if (organization) {
      const newWorkout = await Workout.insert({
        name,
        sets,
        description,
        workoutType,
        equiptment,
        numSets,
        organization,
      });
      if (newWorkout) {
        return true;
      }
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateWorkoutDescription(
    @Arg("workoutId") workoutId: number,
    @Arg("description") description: string
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(Workout)
      .set({ description })
      .where("id = :id", { id: workoutId })
      .execute();
    if (updateRes) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateWorkoutName(
    @Arg("workoutId") workoutId: number,
    @Arg("name") name: string
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(Workout)
      .set({ name })
      .where("id = :id", { id: workoutId })
      .execute();
    if (updateRes) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateWorkoutType(
    @Arg("workoutId") workoutId: number,
    @Arg("workoutType") workoutType: string
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(Workout)
      .set({ workoutType })
      .where("id = :id", { id: workoutId })
      .execute();
    if (updateRes) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateWorkoutEquiptment(
    @Arg("workoutId") workoutId: number,
    @Arg("equiptment") equiptment: string
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(Workout)
      .set({ equiptment })
      .where("id = :id", { id: workoutId })
      .execute();
    if (updateRes) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateWorkoutSets(
    @Arg("workoutId") workoutId: number,
    @Arg("sets") sets: string
  ) {
    const updateRes = await getConnection()
      .createQueryBuilder()
      .update(Workout)
      .set({ sets })
      .where("id = :id", { id: workoutId })
      .execute();
    if (updateRes) {
      return true;
    }
    return false;
  }

  @FieldResolver()
  async organization(@Root() workout: Workout) {
    const team = await getConnection()
      .createQueryBuilder()
      .relation(Workout, "organization")
      .of(workout)
      .loadOne();
    return team;
  }

  @Query(() => [Workout])
  async getWorkouts() {
    const workouts = await Workout.find();
    if (workouts) return workouts;
    return null;
  }

  @Mutation(() => Boolean)
  async deleteWorkout(@Arg("workoutId") workoutId: number) {
    await getConnection().manager.delete(Workout, workoutId);
    return true;
  }

  @Query(() => Workout)
  async getWorkout(@Arg("workoutId") workoutId: string) {
    const workout = await Workout.findOne({
      where: {
        id: workoutId,
      },
    });
    if (workout) return workout;
    return false;
  }
  @Query(() => [Workout])
  async getWorkoutsForTeam(@Arg("teamId") teamId: string) {
    const workouts = await getRepository(Workout).find({
      where: {
        team: teamId,
      },
    });
    if (workouts) {
      return workouts;
    }
    return null;
  }
}
