import { UUIDV4 } from "./GeneralTypes";

export type User = {
  id: UUIDV4<User>;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  job: string;
  bio: string;
};