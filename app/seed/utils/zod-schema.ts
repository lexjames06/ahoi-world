import { SeedOptions } from "@ahoi-world/types/Seed";
import { z } from "zod";

export const seedSchema = z.object({
  option: z.nativeEnum(SeedOptions),
});