import { AuthHeroPanel } from "./AuthHeroPanel";

interface VerifyHeroPanelProps {
  className?: string;
}

/**
 * Backward-compatible alias for the shared auth right-side visual.
 */
export function VerifyHeroPanel({ className }: VerifyHeroPanelProps) {
  return <AuthHeroPanel className={className} />;
}
