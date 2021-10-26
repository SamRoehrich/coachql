import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection, getRepository } from "typeorm";
import { Assessment } from "../entity/Assessment";
import { Organization } from "../entity/Organization";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../utils/auth";
import { isInOrg } from "../utils/org";

@Resolver(() => Assessment)
export class AssessmentResolver {
  @FieldResolver()
  @UseMiddleware(isAuth)
  async organization(@Ctx() { payload }: MyContext) {
    const org = await getRepository(Organization).findOne({
      where: { owner: payload?.userId },
    });
    return org;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(isInOrg)
  async deleteAssessment(@Arg("assessmentId") assessmentId: number) {
    const deleteRes = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Assessment)
      .where("id = :id", { id: assessmentId })
      .execute();
    if (deleteRes) {
      return true;
    } else {
      return false;
    }
  }

  @Query(() => [Assessment])
  async getAssessments() {
    const assessments = await Assessment.find();
    if (assessments) {
      return assessments;
    }
    return null;
  }

  @Query(() => [Assessment])
  @UseMiddleware(isAuth)
  @UseMiddleware(isInOrg)
  async getAssessmentsInOrg(@Ctx() context: MyContext) {
    const assessments = await getRepository(Assessment)
      .createQueryBuilder()
      .where("Assessment.organizationId = :orgId", {
        orgId: context.org?.orgId,
      })
      .getMany();
    if (assessments) {
      return assessments;
    } else {
      return null;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(isInOrg)
  async createAssessment(
    @Ctx() { org }: MyContext,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("dataPoints") dataPoints: string,
    @Arg("tools") tools: string,
    @Arg("type") type: string
  ) {
    const organization = await Organization.findOne(org?.orgId);
    const assessment = await Assessment.insert({
      name,
      description,
      dataPoints,
      testMethod: tools,
      assessmentType: type,
      organization,
    });
    if (assessment && org) {
      await getConnection()
        .createQueryBuilder()
        .relation(Assessment, "organization")
        .of(assessment)
        .set(org.orgId);
      return true;
    }
    return false;
  }
}
