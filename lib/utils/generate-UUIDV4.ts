import { v4 as uuidv4 } from "uuid";
import { OptionalType } from "@/types/GeneralTypes";

const generateUUIDV4 = <T extends OptionalType = undefined>(id?: string): UUIDV4<T> => {
  const uuid = id ? id : uuidv4();
  return uuid as UUIDV4<T>;
}

/**
 * Generate UUIDV4 User ID
 * 
 * @param id string (optional)
 * @returns UUIDV4<User>
 */
export const generateUserId = (id?: string): UUIDV4<User> => {
  return generateUUIDV4<User>(id);
}

/**
 * Generate UUIDV4 Blog Post ID
 * 
 * @param id string (optional)
 * @returns UUIDV4<BlogPost>
 */
export const generateBlogPostId = (id?: string): UUIDV4<BlogPost> => {
  return generateUUIDV4<BlogPost>(id);
}

/**
 * Generate UUIDV4 Project ID
 * 
 * @param id string (optional)
 * @returns UUIDV4<Project>
 */
export const generateProjectId = (id?: string): UUIDV4<Project> => {
  return generateUUIDV4<Project>(id);
}
