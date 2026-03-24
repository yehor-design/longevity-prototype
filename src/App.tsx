import { RouterProvider } from "react-router";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { router } from "@/app/routes";

/**
 * Application root.
 * RootLayout (inside the router) handles providers, theming, and global UI.
 * ErrorBoundary is kept outside to catch any top-level rendering errors.
 */
export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
