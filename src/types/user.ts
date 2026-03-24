/** All possible user roles in the platform */
export type UserRole = "patient" | "doctor" | "admin";

/** Base fields shared across all user types */
export interface BaseUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  role: UserRole;
  avatar: string | null;
  createdAt: string;
  has2FA: boolean;
}

/** Patient-specific user type */
export interface PatientUser extends BaseUser {
  role: "patient";
  consentGiven: boolean;
  /** 0–100 percent */
  questionnaireProgress: number;
  tokenBalance: number;
}

/** Doctor-specific user type */
export interface DoctorUser extends BaseUser {
  role: "doctor";
}

/** Admin-specific user type */
export interface AdminUser extends BaseUser {
  role: "admin";
}

/** Discriminated union of all user types */
export type AppUser = PatientUser | DoctorUser | AdminUser;

/** Helper: derive full display name */
export function getDisplayName(user: AppUser): string {
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.email;
}
