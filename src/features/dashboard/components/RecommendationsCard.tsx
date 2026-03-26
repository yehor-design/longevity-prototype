import { CheckSquare, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { recommendationsData, type Recommendation } from "../data/mockData";

function PriorityTag({ label, type }: { label: string; type: "priority" | "category" }) {
  if (type === "priority") {
    const isHigh = label.toLowerCase().includes("hight") || label.toLowerCase().includes("high");
    return (
      <Badge variant={isHigh ? "danger" : "warning"} className="">
        {label}
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" className="">
      {label}
    </Badge>
  );
}

function RecommendationItem({ rec }: { rec: Recommendation }) {
  const dotColor =
    rec.priority === "high" ? "bg-red-400" : rec.priority === "moderate" ? "bg-amber-400" : "bg-green-400";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full shrink-0 ${dotColor}`} />
          <span className="text-xs font-medium text-foreground">{rec.title}</span>
        </div>
        <p className="text-xs leading-4 text-foreground/65 pl-3">{rec.description}</p>
      </div>
      <div className="flex items-center gap-1 pl-3">
        {rec.tags.map((tag) => (
          <PriorityTag key={tag.label} label={tag.label} type={tag.type} />
        ))}
      </div>
    </div>
  );
}

export function RecommendationsCard() {
  return (
    <Card className="rounded-2xl p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-3">
        <div className="flex items-center justify-center size-10 rounded-xl border border-border bg-white shadow-sm shrink-0">
          <CheckSquare size={20} className="text-foreground" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">Recommendations</span>
          <span className="text-xs text-foreground/70">Based on your latest results</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-5 px-4 pt-4 flex-1">
        {recommendationsData.map((rec) => (
          <RecommendationItem key={rec.id} rec={rec} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Separator />
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-foreground/50">AI-generated from your analytics*</span>
          <Button variant="link" className="h-auto p-0 text-xs font-normal gap-1">
            View All
            <ArrowRight size={12} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
