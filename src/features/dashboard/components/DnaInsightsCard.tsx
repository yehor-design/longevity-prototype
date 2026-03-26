import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { dnaInsightsData, type DnaInsight } from "../data/mockData";

const severityColors: Record<DnaInsight["severity"], { bg: string; border: string; icon: string }> = {
  high: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-500" },
  moderate: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-500" },
  info: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-500" },
};

function DnaInsightItem({ insight }: { insight: DnaInsight }) {
  const colors = severityColors[insight.severity];

  return (
    <div className={`flex gap-3 rounded-xl p-3 ${colors.bg} border ${colors.border}`}>
      <div className="shrink-0 mt-0.5">
        <div className={`flex items-center justify-center size-5 rounded-full ${colors.bg}`}>
          <span className={`size-2.5 rounded-full ${
            insight.severity === "high"
              ? "bg-red-500"
              : insight.severity === "moderate"
                ? "bg-amber-500"
                : "bg-emerald-500"
          }`} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-foreground">{insight.title}</span>
        <span className="text-xs text-muted-foreground leading-4">{insight.description}</span>
      </div>
    </div>
  );
}

export function DnaInsightsCard() {
  const { hasHighRisk, insights } = dnaInsightsData;

  return (
    <Card className="flex flex-col rounded-2xl border-border shadow-sm p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          DNA Insights
        </span>
        {hasHighRisk && (
          <Badge variant="danger" className="uppercase tracking-wide">
            <AlertTriangle />
            High Risk Found
          </Badge>
        )}
      </div>

      {/* Insights list */}
      <div className="flex flex-col gap-3 px-4 flex-1">
        {insights.map((insight) => (
          <DnaInsightItem key={insight.id} insight={insight} />
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 pt-4 mt-auto">
        <Button variant="outline" className="w-full rounded-xl h-11 text-sm font-medium">
          Explore DNA Profile
        </Button>
      </div>
    </Card>
  );
}
