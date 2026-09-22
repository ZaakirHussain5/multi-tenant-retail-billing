import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@retail/config";

const queryClient = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === "test" ? 2 : 10,
  prepare: false,
});

export const db = drizzle(queryClient);
export { queryClient };
