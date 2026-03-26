import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { dnaInsightsData, type DnaInsight } from "../data/mockData";

const severityVariant: Record<DnaInsight["severity"], "error" | "warning" | "success"> = {
  high: "error",
  moderate: "warning",
  info: "success",
};

const SeverityIcon = ({ severity }: { severity: DnaInsight["severity"] }) => {
  if (severity === "high") return <AlertCircle />;
  if (severity === "moderate") return <AlertTriangle />;
  return <CheckCircle2 />;
};

function DnaInsightItem({ insight }: { insight: DnaInsight }) {
  return (
    <Alert variant={severityVariant[insight.severity]} className="rounded-xl">
      <SeverityIcon severity={insight.severity} />
      <AlertTitle>{insight.title}</AlertTitle>
      <AlertDescription className="text-xs">{insight.description}</AlertDescription>
    </Alert>
  );
}

export function DnaInsightsCard() {
  const { hasHighRisk, insights } = dnaInsightsData;

  return (
    <Card className="rounded-2xl p-0 overflow-hidden">
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
      <div className="flex flex-col gap-2 px-4 flex-1">
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
