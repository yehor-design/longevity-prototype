import type { AppUser } from "./user";

/** Active mock auth session */
export interface AuthSession {
  user: AppUser;
  isAuthenticated: boolean;
  loginMethod: "email" | "google";
  sessionStartedAt: string;
  expiresAt: string;
}

/** OTP verification state */
export interface OtpState {
  sent: boolean;
  verified: boolean;
  attemptsLeft: number;
  expiresAt: string | null;
}

/** 2FA setup state */
export interface TwoFactorState {
  setupComplete: boolean;
  qrCodeUrl: string | null;
  verifiedAt: string | null;
}
