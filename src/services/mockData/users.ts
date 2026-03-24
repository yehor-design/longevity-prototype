import type { PatientUser, DoctorUser, AdminUser } from "@/types";

export const MOCK_PATIENT: PatientUser = {
  id: "patient-001",
  email: "alex.miller@example.com",
  firstName: "Alex",
  lastName: "Miller",
  dateOfBirth: "1990-05-15",
  role: "patient",
  avatar: null,
  createdAt: "2026-01-15T10:00:00Z",
  has2FA: true,
  consentGiven: true,
  questionnaireProgress: 15,
  tokenBalance: 73,
};

export const MOCK_DOCTOR: DoctorUser = {
  id: "doctor-001",
  email: "dr.sarah.chen@example.com",
  firstName: "Sarah",
  lastName: "Chen",
  dateOfBirth: "1985-03-22",
  role: "doctor",
  avatar: null,
  createdAt: "2025-11-01T10:00:00Z",
  has2FA: true,
};

export const MOCK_ADMIN: AdminUser = {
  id: "admin-001",
  email: "admin@dthealth.io",
  firstName: "System",
  lastName: "Administrator",
  dateOfBirth: null,
  role: "admin",
  avatar: null,
  createdAt: "2025-01-01T10:00:00Z",
  has2FA: true,
};

export const ALL_MOCK_USERS = [MOCK_PATIENT, MOCK_DOCTOR, MOCK_ADMIN];
