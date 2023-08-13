import { SeedOptions } from "@ahoi-world/types/Seed";
import { User } from "@ahoi-world/types/UserTypes";
import { z } from "zod";

export const seedSchema = z.object({
  option: z.nativeEnum(SeedOptions),
  userId: z.string(),
});