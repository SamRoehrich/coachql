import { hash } from "bcryptjs";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Athlete } from "../entity/Athlete";
import { User } from "../entity/User";

@Resolver()
export class AthleteResolver {
  @Query(() => [Athlete])
  athletes() {
    const athletes = Athlete.find();
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
