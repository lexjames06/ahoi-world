import { UUIDV4 } from "./GeneralTypes";

export type ImagePathAndBase64String = {
  base64String: string;
  path: string;
}

export type BlogPost = {
  id: UUIDV4<BlogPost>;
  userId: UUIDV4<User>;
  path: string;
  date: string;
  image: string;
  images?: ImagePathAndBase64String[];
  length: number;
  title: string;
  category: string;
}