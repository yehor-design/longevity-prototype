import { CardiovascularRiskCard } from "../components/CardiovascularRiskCard";
import { DnaInsightsCard } from "../components/DnaInsightsCard";
import { RecommendationsCard } from "../components/RecommendationsCard";
import { BloodTestResultsSection } from "../components/BloodTestResultsSection";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Top row — 3 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CardiovascularRiskCard />
        <DnaInsightsCard />
        <RecommendationsCard />
      </div>

      {/* Blood test results */}
      <BloodTestResultsSection />
    </div>
  );
}
