import { hash } from "bcryptjs";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Athlete } from "../entity/Athlete";
import { User } from "../entity/User";
import { Event } from "../entity/Event";

@Resolver()
export class AthleteResolver {
  @Query(() => [Athlete])
  async athletes(@Arg("eventId") eventId: string) {
    const event = await Event.findOne(eventId);
    const athletes = await getConnection()
      .createQueryBuilder()
      .relation(Athlete, "user")
      .of(event)
      .loadMany();
    return athletes;
  }

  @Mutation(() => Boolean)
  async createAthlete(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("age") age: number,
    @Arg("team") team: string
  ) {
    const hashedPassword = await hash(password, 12);
    await User.insert({
      lastName,
      firstName,
      email,
      password: hashedPassword,
    });

    const user = await User.findOne({ where: { email } });
    const athlete = Athlete.insert({ user, age, team });

    if (athlete) {
      return true;
    } else {
      return false;
    }
  }
}
