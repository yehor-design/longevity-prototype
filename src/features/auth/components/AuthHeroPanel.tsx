import { cn } from "@/lib/utils";
import authHeroBackgroundPng from "@/assets/auth/auth-hero-background.png";
import authHeroCardBloodPressurePng from "@/assets/auth/auth-hero-card-blood-pressure.png";
import authHeroCardHeartRatePng from "@/assets/auth/auth-hero-card-heart-rate.png";
import authHeroCardHydrationPng from "@/assets/auth/auth-hero-card-hydration.png";
import authHeroCardTensionHeadachePng from "@/assets/auth/auth-hero-card-tension-headache.png";

interface AuthHeroPanelProps {
  className?: string;
}

/**
 * Shared right-side auth illustration for desktop auth/register flows.
 * The image panel is a fixed, screen-height anchored layer with the floating
 * health cards positioned relative to the panel, not the document body.
 */
export function AuthHeroPanel({ className }: AuthHeroPanelProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-y-4 right-4 z-20 hidden w-[calc(50vw-16px)] overflow-visible lg:block",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-visible rounded-[20px]">
        <img
          alt=""
          src={authHeroBackgroundPng}
          className="absolute inset-0 h-full w-full rounded-[20px] object-cover select-none"
        />

        <img
          alt=""
          src={authHeroCardHeartRatePng}
          className="absolute h-[222px] w-[402px] -rotate-[7.34deg] max-w-none select-none"
          style={{ left: "-17.76%", top: "3.91%" }}
        />

        <img
          alt=""
          src={authHeroCardBloodPressurePng}
          className="absolute h-[203px] w-[401px] rotate-[4.56deg] max-w-none select-none"
          style={{ left: "-10.94%", top: "49.47%" }}
        />

        <img
          alt=""
          src={authHeroCardTensionHeadachePng}
          className="absolute h-[208px] w-[376px] rotate-[9.22deg] max-w-none select-none"
          style={{ left: "55.4%", top: "44.23%" }}
        />

        <img
          alt=""
          src={authHeroCardHydrationPng}
          className="absolute h-[216px] w-[400px] -rotate-[6deg] max-w-none select-none"
          style={{ left: "52.27%", top: "68.33%" }}
        />
      </div>
    </div>
  );
}
