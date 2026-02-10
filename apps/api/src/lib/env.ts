import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", "..", ".env"),
  path.resolve(process.cwd(), "..", ".env"),
];

const selected = candidates.find((candidate) => fs.existsSync(candidate));

if (selected) {
  dotenv.config({ path: selected });
} else {
  dotenv.config();
}

const parseInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

const getRequiredString = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const assertNonLocalhostUrl = (name: string, value: string) => {
  try {
    const parsed = new URL(value);
    if (["localhost", "127.0.0.1"].includes(parsed.hostname)) {
      throw new Error(`Environment variable ${name} must not use localhost in production-ready config.`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("must not use localhost")) {
      throw error;
    }
    throw new Error(`Environment variable ${name} must be a valid URL.`);
  }
};

const requiredVariables = ["DATABASE_URL", "WEB_ORIGIN", "SESSION_SECRET", "CSRF_SECRET"] as const;
const missing = requiredVariables.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. Copy apps/api/.env.example and provide production values.`,
  );
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const webOrigin = getRequiredString("WEB_ORIGIN");

if (nodeEnv === "production") {
  assertNonLocalhostUrl("WEB_ORIGIN", webOrigin);
  assertNonLocalhostUrl("DATABASE_URL", getRequiredString("DATABASE_URL"));
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: parseInteger(process.env.PORT ?? process.env.API_PORT, 3000),
  host: process.env.HOST ?? process.env.API_HOST ?? "0.0.0.0",
  webOrigin,
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? webOrigin)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  corsAllowLocalhost: parseBoolean(process.env.CORS_ALLOW_LOCALHOST, nodeEnv !== "production"),
  requestLoggingEnabled: parseBoolean(process.env.REQUEST_LOGGING_ENABLED, true),
  requestLoggingIncludeHealth: parseBoolean(process.env.REQUEST_LOGGING_INCLUDE_HEALTH, false),
  includeErrorDetails: parseBoolean(process.env.ERROR_INCLUDE_DETAILS, nodeEnv !== "production"),
};
