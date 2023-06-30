import { v4 as uuidv4 } from "uuid";
import { OptionalType } from "@/types/GeneralTypes";

const generateUUIDV4 = <T extends OptionalType = undefined>(id?: string): UUIDV4<T> => {
  const uuid = id ? id : uuidv4();
  return uuid as UUIDV4<T>;
}

export const generateUserId = (id?: string): UUIDV4<User> => {
  return generateUUIDV4<User>(id);
}

export const generateBlogPostId = (id?: string): UUIDV4<BlogPost> => {
  return generateUUIDV4<BlogPost>(id);
}

export const generateProjectId = (id?: string): UUIDV4<Project> => {
  return generateUUIDV4<Project>(id);
}
