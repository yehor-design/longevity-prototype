import { Toaster } from "@/components/ui/sonner";

/**
 * Global toast notification provider using Sonner.
 * Mount once at the app root.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  );
}
