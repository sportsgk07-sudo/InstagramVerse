import { prisma } from "@/lib/infrastructure/database/prisma";
import type { Prisma } from "@prisma/client";

type LogLevel = "info" | "warn" | "error" | "debug";

export const logger = {
  async log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
      fn(`[${level.toUpperCase()}]`, message, context ?? "");
    }

    if (level === "error" || level === "warn") {
      try {
        await prisma.systemLog.create({
          data: {
            level,
            message,
            context: (context ?? undefined) as Prisma.InputJsonValue | undefined,
            source: "app",
          },
        });
      } catch {
        // DB logging failure is non-fatal
      }
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    return this.log("info", message, context);
  },

  warn(message: string, context?: Record<string, unknown>) {
    return this.log("warn", message, context);
  },

  error(message: string, context?: Record<string, unknown>) {
    return this.log("error", message, context);
  },

  debug(message: string, context?: Record<string, unknown>) {
    return this.log("debug", message, context);
  },
};
