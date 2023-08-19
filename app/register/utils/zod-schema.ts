import { z } from "zod";

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const passwordNumberRegex = /^(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
export const passwordLowercaseRegex = /^(?=.*[a-z])[A-Za-z\d@$!%*#?&]{8,}$/
export const passwordUppercaseRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*#?&]{8,}$/
export const passwordSpecialCharacterRegex = /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .regex(passwordNumberRegex, "password must contain at least 1 number")
    .regex(passwordLowercaseRegex, "password must contain at least 1 lowercase character")
    .regex(passwordUppercaseRegex, "password must contain at least 1 uppercase character")
    .regex(passwordSpecialCharacterRegex, "password must contain at least 1 special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "The passwords do not match",
  path: ["confirmPassword"],
});