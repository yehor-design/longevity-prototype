import { z } from "zod";

/**
 * Centralized prototype mode configuration.
 * Toggle PROTOTYPE_MODE to false before shipping to production.
 */
export const PROTOTYPE_MODE = true;

export const prototypeConfig = {
  /** Auth bypass */
  autoAcceptOtp: true,
  autoAcceptTwoFactor: true,
  fakeGoogleOAuth: true,
  skipEmailValidation: true,

  /** Form bypass */
  allFieldsOptional: true,
  skipFormatValidation: true,

  /** Timing */
  mockApiDelay: { min: 300, max: 800 },
  otpCountdownSeconds: 900,
  sessionTimeoutMinutes: 15,

  /** UI helpers */
  showPrototypeBadge: true,
  showDevToolbar: true,
  quickLoginEnabled: true,
} as const;

/**
 * Wraps any Zod schema and makes it fully permissive in prototype mode.
 * In production mode the original schema is returned unchanged.
 */
export function createPrototypeSchema<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny {
  if (!PROTOTYPE_MODE) return schema;
  return z.any();
}
