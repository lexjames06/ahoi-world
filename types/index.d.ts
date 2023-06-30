import { UUIDV4 as UUIDV4T, OptionalType } from "./GeneralTypes";
import { BlogPost as BlogPostT } from "./PostTypes";
import { Project as ProjectT } from "./ProjectTypes";
import { User as UserT } from "./UserTypes";

declare global {
  type BlogPost = BlogPostT;
  type User = UserT;
  type Project = ProjectT;
  type UUIDV4<T extends OptionalType = undefined> = UUIDV4T<T>;
}

export {}
