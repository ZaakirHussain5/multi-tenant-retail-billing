import pino from "pino";

import { env } from "@retail/config";

const logger = pino({ level: env.LOG_LEVEL });

logger.info({ service: "retail-worker" }, "worker started");

const shutdown = (signal: string): void => {
  logger.info({ signal }, "worker stopped");
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
