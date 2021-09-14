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
import { getConnection, getRepository } from "typeorm";
import { Team } from "../entity/Team";
import { Workout } from "../entity/Workout";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";

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
    @Arg("sets") sets: number,
    @Arg("description") description: string,
    @Arg("workoutType") workoutType: string,
    @Arg("timerType") timerType: string,
    @Arg("equiptment") equiptment: string,
    @Arg("intervals") intervals: string,
    @Arg("teamId") teamId: string,
    @Ctx() { payload }: MyContext
  ) {
    // console.log(
    //   name,
    //   sets,
    //   description,
    //   workoutType,
    //   payload,
    //   timerType,
    //   equiptment,
    //   intervals
    // );
    if (payload) {
      const team = await Team.findOne({
        where: {
          headCoach: payload?.userId,
        },
      });

      console.log("cw" + teamId);
      if (team) {
        console.log("team" + team);
        const insertRes = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Workout)
          .values({
            name,
            sets,
            description,
            workoutType,
            timerType,
            intervals,
            equiptment,
          })
          .execute();
        if (insertRes) {
          console.log(insertRes);
          const connection = getConnection();
          const workout = await Workout.findOne({
            where: { id: insertRes.identifiers[0].id },
          });
          if (workout) {
            workout.team = team;
            await connection.manager.save(workout);
            return true;
          }
        }
      }
    }
    return false;
  }

  @FieldResolver()
  async team(@Root() workout: Workout) {
    const team = await getConnection()
      .createQueryBuilder()
      .relation(Workout, "team")
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

// interface InitialValues {
//   name: string;
//   description: string;
//   sets: number;
//   equiptment: string;
//   workoutType: string;
//   timerType: string;
//   intervals: Interval[];
// }
