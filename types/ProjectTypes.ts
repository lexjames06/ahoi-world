import { UUIDV4 } from "./GeneralTypes";

export type Project = {
  id: UUIDV4<Project>;
  userId: UUIDV4<User>;
  company: string;
  name: string;
  start: string;
  end: string;
  role: string;
  technologies: string[];
}
