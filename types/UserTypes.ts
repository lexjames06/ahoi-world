import { UUIDV4 } from "./GeneralTypes";

export type User = {
  id: UUIDV4<User>;
  username: string | null;
  email: string | null;
  displayName: string | null;
  job: string | null;
  bio: string | null;
  photoURL: string | null;
};