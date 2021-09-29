import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Athlete } from "../entity/Athlete";
import { Session } from "../entity/Session";
import { Workout } from "../entity/Workout";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";

@Resolver(() => Session)
export class SessionResolver {
  @FieldResolver()
  async workout(@Root() session: Session) {
    const workout = await getConnection()
      .createQueryBuilder()
      .relation(Session, "workout")
      .of(session)
      .loadOne();
    return workout;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async logSession(
    @Ctx() { payload }: MyContext,
    @Arg("workoutId") workoutId: number,
    @Arg("percentCompleted") percentCompleted: number,
    @Arg("rpe") rpe: number,
    @Arg("notes") notes: string
  ) {
    const date = new Date();
    const athlete = await Athlete.findOne({
      where: {
        user: {
          id: payload?.userId,
        },
      },
    });
    const workout = await Workout.findOne({
      where: {
        id: workoutId,
      },
    });
    if (athlete && workout) {
      const newSession = await Session.insert({
        notes,
        rpe,
        percentCompleted,
        workout,
        date: date.toString(),
      });
      if (newSession) {
        console.log(newSession);
        await getConnection()
          .createQueryBuilder()
          .relation(Athlete, "sessions")
          .of(athlete)
          .add(newSession.identifiers[0]);
        return true;
      }
    }
    return false;
  }
}
