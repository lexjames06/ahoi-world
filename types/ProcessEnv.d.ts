import { z } from "zod";

const envVariables = z.object({
  // firebase config
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_EMULATOR_HOST: z.string(),

  // emulator
  NEXT_PUBLIC_EMULATOR: z.string(),
  NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT: z.string(),

  // application
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_FEATURE_FLAGS: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
