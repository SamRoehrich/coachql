import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection, getRepository } from "typeorm";
import { Assessment } from "../entity/Assessment";
import { Athlete } from "../entity/Athlete";
import { Record } from "../entity/Record";
import { isAuth } from "../utils/auth";

@Resolver(() => Record)
export class RecordResolver {
  @FieldResolver()
  @UseMiddleware(isAuth)
  async athlete(@Root() record: Record) {
    const athlete = await getConnection()
      .createQueryBuilder()
      .relation(Record, "athlete")
      .of(record)
      .loadOne();
    return athlete;
  }

  @FieldResolver()
  @UseMiddleware(isAuth)
  async assessment(@Root() record: Record) {
    const athlete = await getConnection()
      .createQueryBuilder()
      .relation(Record, "assessment")
      .of(record)
      .loadOne();
    return athlete;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createRecord(
    @Arg("athleteId") athleteId: number,
    @Arg("data") data: string,
    @Arg("date") date: string,
    @Arg("assessmentId") assessmentId: number
  ) {
    const athlete = await getRepository(Athlete).findOne(athleteId);
    const assessment = await getRepository(Assessment).findOne(assessmentId);

    if (athlete && assessment) {
      await Record.insert({
        assessment,
        athlete,
        data,
        date,
      });
      return true;
    } else {
      return false;
    }
  }

  @Query(() => [Record])
  @UseMiddleware(isAuth)
  async getRecords() {
    return await Record.find();
  }
}
