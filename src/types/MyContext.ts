import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: number; success: boolean };
  org?: { orgId: number; role: string };
}
