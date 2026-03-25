import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { DoctorLayout } from "@/app/layouts/DoctorLayout";
import { PrototypeAuthGuard } from "./PrototypeAuthGuard";
import { PlaceholderPage } from "./PlaceholderPage";
import { DevPage } from "@/features/dev/DevPage";
import { WelcomePage } from "@/features/auth/pages/WelcomePage";
import { RegisterVerifyPage } from "@/features/auth/pages/RegisterVerifyPage";
import { LoginEmailPage } from "@/features/auth/pages/LoginEmailPage";
import { LoginVerifyPage } from "@/features/auth/pages/LoginVerifyPage";
import { Register2faPage } from "@/features/auth/pages/Register2faPage";
import { RegisterProfilePage } from "@/features/auth/pages/RegisterProfilePage";
import { RegisterConsentPage } from "@/features/auth/pages/RegisterConsentPage";
import { RegisterGoogle2faPage } from "@/features/auth/pages/RegisterGoogle2faPage";
import { RegisterGoogleConsentPage } from "@/features/auth/pages/RegisterGoogleConsentPage";

export const router = createBrowserRouter([
  {
    // RootLayout wraps ALL routes — mounts Toaster, PrototypeBadge, DevToolbar
    // inside the router context so hooks like useLocation() work correctly.
    element: <RootLayout />,
    children: [
      // Redirect root → welcome
      { path: "/", element: <Navigate to="/welcome" replace /> },

      // WelcomePage is a full-screen split layout — rendered outside PublicLayout
      { path: "/welcome", element: <WelcomePage /> },
      { path: "/register/email", element: <Navigate to="/welcome" replace /> },
      { path: "/register/verify", element: <RegisterVerifyPage /> },
      { path: "/login/email", element: <LoginEmailPage /> },
      { path: "/login/verify", element: <LoginVerifyPage /> },
      { path: "/register/2fa-setup", element: <Register2faPage /> },

      { path: "/register/profile", element: <RegisterProfilePage /> },
      { path: "/consent", element: <RegisterConsentPage /> },
      { path: "/register/google/2fa-setup", element: <RegisterGoogle2faPage /> },
      { path: "/register/google/consent", element: <RegisterGoogleConsentPage /> },

      // ── Public routes ──────────────────────────────────────────────────
      {
        element: <PublicLayout />,
        children: [
          { path: "/login", element: <PlaceholderPage title="Login" /> },
          { path: "/login/2fa", element: <PlaceholderPage title="Login — 2FA" /> },
          { path: "/privacy", element: <PlaceholderPage title="Privacy Policy" /> },
          { path: "/terms", element: <PlaceholderPage title="Terms of Service" /> },
          { path: "/ai-explanation", element: <PlaceholderPage title="AI Explanation" /> },
        ],
      },

      // ── Patient routes (auth-guarded) ──────────────────────────────────
      {
        element: (
          <PrototypeAuthGuard requiredRole="patient">
            <AppLayout />
          </PrototypeAuthGuard>
        ),
        children: [
          { path: "/app/dashboard", element: <PlaceholderPage title="Dashboard" /> },
          { path: "/app/questionnaire", element: <PlaceholderPage title="Questionnaire" /> },
          { path: "/app/tests", element: <PlaceholderPage title="My Tests" /> },
          { path: "/app/test/:testType/:id", element: <PlaceholderPage title="Test Analysis" /> },
          { path: "/app/marketplace", element: <PlaceholderPage title="Marketplace" /> },
          { path: "/app/marketplace/:id", element: <PlaceholderPage title="Product Detail" /> },
          { path: "/app/consultations", element: <PlaceholderPage title="Consultations" /> },
          { path: "/app/consultations/:id", element: <PlaceholderPage title="Consultation Detail" /> },
          { path: "/app/tokens", element: <PlaceholderPage title="Token Wallet" /> },
          { path: "/app/profile", element: <PlaceholderPage title="My Profile" /> },
          { path: "/app/profile/edit", element: <PlaceholderPage title="Edit Profile" /> },
        ],
      },

      // ── Doctor routes (auth-guarded, role: doctor) ─────────────────────
      {
        element: (
          <PrototypeAuthGuard requiredRole="doctor">
            <DoctorLayout />
          </PrototypeAuthGuard>
        ),
        children: [
          { path: "/doctor/patients", element: <PlaceholderPage title="My Patients" /> },
          { path: "/doctor/patients/:id", element: <PlaceholderPage title="Patient Dashboard (Read-only)" /> },
        ],
      },

      // ── Admin routes (auth-guarded, role: admin) ───────────────────────
      {
        element: (
          <PrototypeAuthGuard requiredRole="admin">
            <AdminLayout />
          </PrototypeAuthGuard>
        ),
        children: [
          { path: "/admin/users", element: <PlaceholderPage title="User Management" /> },
          { path: "/admin/questionnaires", element: <PlaceholderPage title="Questionnaire Builder" /> },
          { path: "/admin/marketplace", element: <PlaceholderPage title="Marketplace Management" /> },
          { path: "/admin/consultations", element: <PlaceholderPage title="Consultation Config" /> },
          { path: "/admin/tokens", element: <PlaceholderPage title="Token Configuration" /> },
          { path: "/admin/orders", element: <PlaceholderPage title="Order Management" /> },
          { path: "/admin/audit-logs", element: <PlaceholderPage title="Audit Logs" /> },
          { path: "/admin/profile", element: <PlaceholderPage title="Admin Profile" /> },
        ],
      },

      // ── System pages ───────────────────────────────────────────────────
      { path: "/404", element: <PlaceholderPage title="404 — Not Found" /> },
      { path: "/error", element: <PlaceholderPage title="Error" /> },
      { path: "/maintenance", element: <PlaceholderPage title="Maintenance" /> },
      { path: "*", element: <Navigate to="/404" replace /> },

      // ── Dev smoke-test (REMOVE in production) ──────────────────────────
      { path: "/dev", element: <DevPage /> },
    ],
  },
]);
