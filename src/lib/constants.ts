/** All application route paths */
export const ROUTES = {
  // Public
  WELCOME: "/welcome",
  REGISTER_EMAIL: "/register/email",
  REGISTER_VERIFY: "/register/verify",
  REGISTER_2FA: "/register/2fa-setup",
  REGISTER_PROFILE: "/register/profile",
  CONSENT: "/consent",
  REGISTER_GOOGLE_2FA: "/register/google/2fa-setup",
  REGISTER_GOOGLE_CONSENT: "/register/google/consent",
  LOGIN: "/login",
  LOGIN_EMAIL: "/login/email",
  LOGIN_VERIFY: "/login/verify",
  LOGIN_2FA: "/login/2fa",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  AI_EXPLANATION: "/ai-explanation",

  // Patient (app)
  DASHBOARD: "/app/dashboard",
  QUESTIONNAIRE: "/app/questionnaire",
  TESTS: "/app/tests",
  MARKETPLACE: "/app/marketplace",
  CONSULTATIONS: "/app/consultations",
  TOKENS: "/app/tokens",
  PROFILE: "/app/profile",
  PROFILE_EDIT: "/app/profile/edit",

  // Doctor
  DOCTOR_PATIENTS: "/doctor/patients",

  // Admin
  ADMIN_USERS: "/admin/users",
  ADMIN_QUESTIONNAIRES: "/admin/questionnaires",
  ADMIN_MARKETPLACE: "/admin/marketplace",
  ADMIN_CONSULTATIONS: "/admin/consultations",
  ADMIN_TOKENS: "/admin/tokens",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_AUDIT: "/admin/audit-logs",
  ADMIN_PROFILE: "/admin/profile",

  // System
  NOT_FOUND: "/404",
  ERROR: "/error",
  MAINTENANCE: "/maintenance",

  // Dev
  DEV: "/dev",
} as const;

/** Home route per role */
export const ROLE_HOME = {
  patient: ROUTES.DASHBOARD,
  doctor: ROUTES.DOCTOR_PATIENTS,
  admin: ROUTES.ADMIN_USERS,
} as const;

/** Responsive breakpoints (matches Tailwind defaults) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const CONTENT_MAX_WIDTH = 1400;
