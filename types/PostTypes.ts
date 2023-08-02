import { UUIDV4 } from "./GeneralTypes";
import { User } from "./UserTypes";

export type ImagePathAndBase64String = {
  base64String: string;
  path: string;
}

export type BlogPost = {
  id: UUIDV4<BlogPost>;
  userId: UUIDV4<User>;
  path: string;
  date: Date;
  description: string;
  image: string;
  images?: string[];
  length: number;
  title: string;
  category: string;
  body: string[];
}