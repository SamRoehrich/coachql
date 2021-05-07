// import { Athlete } from "../entity/Athlete";
import { Catagory } from "../entity/Stack";

export const getAgeCatagory = (birthYear: number) => {
  switch (birthYear) {
    case 2010:
      return Catagory.D;
    case 2009:
      return Catagory.C;
    case 2008:
      return Catagory.C;
    case 2007:
      return Catagory.B;
    case 2006:
      return Catagory.B;
    case 2005:
      return Catagory.A;
    case 2004:
      return Catagory.A;
    case 2003:
      return Catagory.JR;
    case 2002:
      return Catagory.JR;
    default:
      return Catagory.D;
  }
};
