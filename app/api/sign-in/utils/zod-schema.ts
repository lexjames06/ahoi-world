import { z } from "zod";

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const passwordNumberRegex = /^(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
export const passwordLowercaseRegex = /^(?=.*[a-z])[A-Za-z\d@$!%*#?&]{8,}$/
export const passwordUppercaseRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*#?&]{8,}$/
export const passwordSpecialCharacterRegex = /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});