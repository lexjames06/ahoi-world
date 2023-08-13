import { z } from "zod";

export const usernameRegex = /[a-zA-Z0-9_-]{1,15}/g;

export const createUsernameSchema = z.object({
  username: z.string().min(4, "username must be at least 4 characters").max(15, "username can not be more than 15 characters").regex(usernameRegex, "username must only contain letters, numbers, _ and -"),
});