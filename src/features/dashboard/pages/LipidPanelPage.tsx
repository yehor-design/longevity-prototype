import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import * as d3 from "d3";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  TriangleAlert,
  Check,
  Info,
  Sparkles,
  Dna,
  ListChecks,
  Plus,
  ChartLine,
  Home,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type MarkerStatus = "High" | "Borderline" | "Normal";

interface QuickMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: MarkerStatus;
  ref: string;
  delta: string;
  deltaDir: "up" | "down";
}

interface ParameterRow {
  test: string;
  value: number;
  unit: string;
  delta: string;
  deltaDir: "up" | "down";
  status: MarkerStatus;
}

interface GeneticVariant {
  name: string;
  impact: "HIGH IMPACT" | "MODERATE";
  description: string;
}

interface RecommendationItem {
  category: "Lifestyle" | "Clinical" | "Follow-up";
  text: string;
}

interface HistoricalDataPoint {
  date: string;
  ldl: number;
  totalChol: number;
  hdl: number;
  apoB: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_BADGE_VARIANT: Record<string, "danger" | "warning" | "success"> = {
  High: "danger",
  Borderline: "warning",
  Normal: "success",
  "HIGH IMPACT": "danger",
  MODERATE: "warning",
};

const CATEGORY_BADGE_VARIANT: Record<string, "success" | "blue" | "orange"> = {
  Lifestyle: "success",
  Clinical: "blue",
  "Follow-up": "orange",
};

const CHART_SERIES = [
  { key: "totalChol" as const, label: "Total Chol", color: "#1e40af" },
  { key: "ldl" as const, label: "LDL", color: "#ef4444" },
  { key: "apoB" as const, label: "ApoB", color: "#f59e0b" },
  { key: "hdl" as const, label: "HDL", color: "#14b8a6" },
];

const TIME_RANGES = [
  { value: "all", label: "All time" },
  { value: "2y", label: "Last 2y" },
  { value: "1y", label: "Last year" },
  { value: "6m", label: "6 months" },
];

const CHART_MARGIN = { top: 12, right: 24, bottom: 50, left: 44 };

// ─── Mock Data ──────────────────────────────────────────────────────────────

const QUICK_METRICS: QuickMetric[] = [
  { id: "ldl", label: "LDL Cholesterol", value: 160, unit: "mg/dL", status: "High", ref: "< 130", delta: "↑15", deltaDir: "up" },
  { id: "hdl", label: "HDL Cholesterol", value: 45, unit: "mg/dL", status: "Borderline", ref: "> 40", delta: "↓1", deltaDir: "down" },
  { id: "apoB", label: "ApoB", value: 125, unit: "mg/dL", status: "High", ref: "< 100", delta: "↑7", deltaDir: "up" },
  { id: "tg", label: "Triglycerides", value: 140, unit: "mg/dL", status: "Normal", ref: "< 150", delta: "↑5", deltaDir: "up" },
];

const PARAMETERS: ParameterRow[] = [
  { test: "Total Cholesterol", value: 230, unit: "mg/dL", delta: "↑10", deltaDir: "up", status: "High" },
  { test: "LDL Cholesterol", value: 160, unit: "mg/dL", delta: "↑15", deltaDir: "up", status: "High" },
  { test: "HDL Cholesterol", value: 45, unit: "mg/dL", delta: "↓1", deltaDir: "down", status: "Borderline" },
  { test: "Triglycerides", value: 140, unit: "mg/dL", delta: "↑5", deltaDir: "up", status: "Normal" },
  { test: "VLDL", value: 28, unit: "mg/dL", delta: "↑1", deltaDir: "up", status: "Normal" },
  { test: "ApoB", value: 125, unit: "mg/dL", delta: "↑7", deltaDir: "up", status: "High" },
  { test: "Non-HDL Cholesterol", value: 185, unit: "mg/dL", delta: "↑15", deltaDir: "up", status: "High" },
];

const GENETIC_VARIANTS: GeneticVariant[] = [
  {
    name: "APOE \u03B54",
    impact: "HIGH IMPACT",
    description:
      "Your LDL (160 mg/dL) and ApoB (125 mg/dL) are above optimal. Discuss lipid-lowering strategies with your provider.",
  },
  {
    name: "PCSK9 variant",
    impact: "MODERATE",
    description:
      "Gain-of-function variant may reduce LDL receptor availability, contributing to elevated LDL-C.",
  },
];

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    category: "Lifestyle",
    text: "Reduce saturated fat to <7% of calories; increase soluble fiber (oats, legumes, flaxseed) to 10\u201325g/day.",
  },
  {
    category: "Clinical",
    text: "Discuss statin therapy eligibility with your provider given LDL >160 + APOE \u03B54 carrier status.",
  },
  {
    category: "Follow-up",
    text: "Repeat lipid panel in 3 months to assess trajectory before initiating pharmacotherapy.",
  },
];

const HISTORICAL_DATA: HistoricalDataPoint[] = [
  { date: "2024-01-15", ldl: 135, totalChol: 210, hdl: 48, apoB: 100 },
  { date: "2024-04-15", ldl: 142, totalChol: 225, hdl: 50, apoB: 108 },
  { date: "2024-07-15", ldl: 128, totalChol: 218, hdl: 42, apoB: 95 },
  { date: "2024-10-15", ldl: 138, totalChol: 205, hdl: 46, apoB: 105 },
  { date: "2025-01-15", ldl: 145, totalChol: 215, hdl: 44, apoB: 112 },
  { date: "2025-04-15", ldl: 132, totalChol: 220, hdl: 41, apoB: 98 },
  { date: "2025-07-15", ldl: 140, totalChol: 212, hdl: 47, apoB: 107 },
  { date: "2025-10-15", ldl: 150, totalChol: 222, hdl: 43, apoB: 118 },
  { date: "2026-01-15", ldl: 155, totalChol: 228, hdl: 46, apoB: 120 },
  { date: "2026-03-08", ldl: 160, totalChol: 230, hdl: 45, apoB: 125 },
];

const DONUT_DATA = [
  { label: "LDL", value: 69, color: "#ef4444" },
  { label: "HDL", value: 19, color: "#22c55e" },
  { label: "VLDL", value: 12, color: "#f59e0b" },
];

// ─── Status Icon ────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: MarkerStatus }) {
  switch (status) {
    case "High":
      return <ArrowUp size={10} />;
    case "Borderline":
      return <TriangleAlert size={10} />;
    case "Normal":
      return <Check size={10} />;
  }
}

// ─── Donut Chart (D3) ──────────────────────────────────────────────────────

function DonutChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const size = 160;
    const radius = size / 2;
    const innerRadius = radius * 0.62;

    const g = svg
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${radius},${radius})`);

    const pieGen = d3
      .pie<(typeof DONUT_DATA)[0]>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.03);

    const arcGen = d3
      .arc<d3.PieArcDatum<(typeof DONUT_DATA)[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 2)
      .cornerRadius(3);

    g.selectAll("path")
      .data(pieGen(DONUT_DATA))
      .enter()
      .append("path")
      .attr("fill", (d) => d.data.color)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attrTween("d", function (d) {
        const i = d3.interpolate(
          { startAngle: d.startAngle, endAngle: d.startAngle },
          d,
        );
        return (t) => arcGen(i(t)) || "";
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Cholesterol Composition
      </p>
      <div className="relative">
        <svg ref={svgRef} className="block" width={160} height={160} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">230</span>
          <span className="text-xs text-muted-foreground">Total mg/dL</span>
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        {DONUT_DATA.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Header Section ─────────────────────────────────────────────────────────

function HeaderSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/app/dashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/app/dashboard");
              }}
            >
              <Home size={16} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/app/tests"
              onClick={(e) => {
                e.preventDefault();
                navigate("/app/tests");
              }}
            >
              Blood test
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lipid Panel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full shrink-0"
            onClick={() => navigate("/app/dashboard")}
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Lipid Panel + ApoB
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">March 8, 2026</span>
          <Badge variant="warning">Suboptimal</Badge>
        </div>
      </div>
    </div>
  );
}

// ─── Summary Card ───────────────────────────────────────────────────────────

function SummaryCard() {
  return (
    <Card className="gap-0 p-0 overflow-hidden bg-emerald-50/30 dark:bg-emerald-950/10">
      <div className="flex gap-8 p-6">
        {/* Left: AI summary */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              AI Clinical Summary
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">
            Your lipid profile reveals an elevated atherogenic pattern. LDL is
            at{" "}
            <strong className="text-foreground">160 mg/dL</strong> ({"\u2191"}15
            from Jan) and ApoB at{" "}
            <strong className="text-foreground">125 mg/dL</strong> {"\u2014"}{" "}
            both reflecting high circulating atherogenic particles. Combined with
            your{" "}
            <strong className="text-primary">
              APOE {"\u03B5"}4 carrier status
            </strong>
            , this creates a compounded cardiovascular risk that warrants
            proactive intervention.
          </p>

          {/* 6-month changes */}
          <div className="flex gap-10">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                LDL 6-mo change
              </span>
              <span className="text-2xl font-bold text-destructive mt-0.5">
                +18.5%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ApoB 6-mo change
              </span>
              <span className="text-2xl font-bold text-destructive mt-0.5">
                +19%
              </span>
            </div>
          </div>

          {/* Combined risk */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Combined risk
            </span>
            <span className="text-sm text-foreground/80">
              Elevated LDL + ApoB + APOE {"\u03B5"}4 = heightened CVD risk
            </span>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            LDL has trended upward over 6 months (135 {"\u2192"} 145 {"\u2192"}{" "}
            160). HDL remains borderline at 45 mg/dL, reducing protective
            capacity. Non-HDL cholesterol of 185 mg/dL further confirms the
            pattern.
          </p>
        </div>

        {/* Right: Donut chart */}
        <div className="shrink-0 flex items-start pt-6">
          <DonutChart />
        </div>
      </div>

      {/* Separator + Disclaimer */}
      <Separator />
      <div className="flex items-center gap-2 px-6 py-3">
        <Info size={12} className="text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">
          For educational purposes only {"\u2014"} not a medical diagnosis.
          Always consult a qualified healthcare provider before making treatment
          decisions.
        </p>
      </div>
    </Card>
  );
}

// ─── Quick Metric Card ──────────────────────────────────────────────────────

function QuickMetricCard({ metric }: { metric: QuickMetric }) {
  const deltaColor =
    metric.status === "High"
      ? "text-destructive"
      : metric.status === "Borderline"
        ? "text-amber-600 dark:text-amber-400"
        : "text-muted-foreground";

  return (
    <Card className="gap-0 p-4 rounded-xl">
      {/* Top: label + status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{metric.label}</span>
        <Badge variant={STATUS_BADGE_VARIANT[metric.status]}>
          <StatusIcon status={metric.status} />
          {metric.status}
        </Badge>
      </div>
      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-foreground">
          {metric.value}
        </span>
        <span className="text-sm text-muted-foreground">{metric.unit}</span>
      </div>
      {/* Bottom: ref + delta */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          Ref: {metric.ref}
        </span>
        <span className={cn("text-xs font-medium", deltaColor)}>
          {metric.delta}
        </span>
      </div>
    </Card>
  );
}

// ─── All Parameters Card ────────────────────────────────────────────────────

function AllParametersCard() {
  return (
    <Card className="gap-0 p-0 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-base font-semibold text-foreground">
          All Parameters
        </h3>
        <span className="text-xs text-muted-foreground">7 markers</span>
      </div>

      <Separator className="mx-4" />

      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-4 py-2 text-xs text-muted-foreground">
        <span>Test</span>
        <span className="w-16 text-right">Result</span>
        <span className="w-8 text-center">{"\u0394"}</span>
        <span className="w-16 text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="px-4 pb-4 flex flex-col">
        {PARAMETERS.map((row) => {
          const deltaColor =
            row.status === "High"
              ? "text-destructive"
              : row.status === "Borderline"
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground";

          return (
            <div
              key={row.test}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center py-2 text-sm border-b border-border/50 last:border-b-0"
            >
              <span className="text-foreground truncate">{row.test}</span>
              <span className="w-16 text-right">
                <span className="font-medium">{row.value}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  {row.unit}
                </span>
              </span>
              <span
                className={cn("w-8 text-center text-xs font-medium", deltaColor)}
              >
                {row.delta}
              </span>
              <span className="w-16 flex justify-end">
                <Badge
                  variant={STATUS_BADGE_VARIANT[row.status]}
                  className="text-[10px] px-1 py-0"
                >
                  <StatusIcon status={row.status} />
                  {row.status}
                </Badge>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Genetic Variants Card ──────────────────────────────────────────────────

function GeneticVariantsCard() {
  const navigate = useNavigate();

  return (
    <Card className="gap-0 p-0 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
          <Dna size={20} className="text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Related Genetic Variants
        </h3>
      </div>

      {/* Variant cards */}
      <div className="px-4 flex flex-col gap-2">
        {GENETIC_VARIANTS.map((variant) => (
          <div
            key={variant.name}
            className="rounded-lg border bg-card p-3 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-foreground/50 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                {variant.name}
              </span>
              <Badge
                variant={STATUS_BADGE_VARIANT[variant.impact]}
                className="text-[10px] px-1.5 py-0"
              >
                {variant.impact}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground pl-3.5">
              {variant.description}
            </p>
          </div>
        ))}
      </div>

      <Separator className="mt-3" />

      {/* Link */}
      <div className="px-4 py-3">
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-primary gap-1"
          onClick={() => {
            console.log("Navigating to full genetic profile");
            navigate("/app/tests");
          }}
        >
          View full genetic profile
          <ArrowRight size={12} />
        </Button>
      </div>
    </Card>
  );
}

// ─── Recommendations Card ───────────────────────────────────────────────────

function RecommendationsCard() {
  return (
    <Card className="gap-0 p-0 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <ListChecks
            size={20}
            className="text-blue-600 dark:text-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-foreground">
            Recommendations
          </h3>
          <span className="text-xs text-muted-foreground">
            Based on your latest results
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 pb-4 flex flex-col gap-3">
        {RECOMMENDATIONS.map((rec) => (
          <div key={rec.category} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Badge variant={CATEGORY_BADGE_VARIANT[rec.category]}>
                {rec.category}
              </Badge>
              <Button
                variant="ghost"
                size="xs"
                className="text-[10px] text-muted-foreground gap-1 h-5"
                onClick={() =>
                  console.log(`Adding ${rec.category} recommendation to To-Do`)
                }
              >
                <Plus size={10} />
                Add to To-Do
              </Button>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {rec.text}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Historical Trends Chart (D3) ──────────────────────────────────────────

function HistoricalTrendsChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeRange, setActiveRange] = useState("all");
  const [containerWidth, setContainerWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: Date;
    values: { key: string; label: string; color: string; value: number }[];
  } | null>(null);

  const chartHeight = 380;

  // Responsive width via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Filter data by time range
  const filteredData = useMemo(() => {
    const now = new Date("2026-03-08");
    let cutoff: Date;
    switch (activeRange) {
      case "6m":
        cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case "1y":
        cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case "2y":
        cutoff = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
        break;
      default:
        cutoff = new Date("2020-01-01");
    }
    return HISTORICAL_DATA.filter((d) => new Date(d.date) >= cutoff);
  }, [activeRange]);

  // Parsed data with Date objects
  const parsedData = useMemo(
    () => filteredData.map((d) => ({ ...d, dateObj: new Date(d.date) })),
    [filteredData],
  );

  // D3 drawing logic
  const drawChart = useCallback(() => {
    if (!svgRef.current || containerWidth === 0 || parsedData.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const w = containerWidth - CHART_MARGIN.left - CHART_MARGIN.right;
    const h = chartHeight - CHART_MARGIN.top - CHART_MARGIN.bottom;

    const g = svg
      .attr("width", containerWidth)
      .attr("height", chartHeight)
      .append("g")
      .attr("transform", `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.dateObj) as [Date, Date])
      .range([0, w]);

    const yScale = d3.scaleLinear().domain([0, 270]).range([h, 0]);

    // Horizontal grid lines
    const yTicks = [30, 65, 100, 130, 195, 260];
    g.selectAll(".grid-line")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", w)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 0.5);

    // Bottom axis line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", w)
      .attr("y1", h)
      .attr("y2", h)
      .attr("stroke", "#d1d5db")
      .attr("stroke-width", 1);

    // Optimal zone (green band from 0 to 130)
    g.append("rect")
      .attr("x", 0)
      .attr("y", yScale(130))
      .attr("width", w)
      .attr("height", yScale(0) - yScale(130))
      .attr("fill", "rgba(34, 197, 94, 0.06)")
      .attr("rx", 2);

    // Reference line at 130
    g.append("line")
      .attr("x1", 0)
      .attr("x2", w)
      .attr("y1", yScale(130))
      .attr("y2", yScale(130))
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.4);

    // Reference line label
    g.append("text")
      .attr("x", w - 4)
      .attr("y", yScale(130) + 14)
      .attr("text-anchor", "end")
      .attr("fill", "#22c55e")
      .attr("font-size", "10px")
      .attr("opacity", 0.8)
      .text("LDL Optimal (<130)");

    // Area fills between adjacent series (banded)
    const seriesKeys = ["totalChol", "ldl", "apoB", "hdl"] as const;

    for (let i = 0; i < seriesKeys.length; i++) {
      const key = seriesKeys[i];
      const belowKey = i < seriesKeys.length - 1 ? seriesKeys[i + 1] : null;
      const seriesInfo = CHART_SERIES.find((s) => s.key === key)!;

      const areaGen = d3
        .area<(typeof parsedData)[0]>()
        .x((d) => xScale(d.dateObj))
        .y0((d) => (belowKey ? yScale(d[belowKey]) : yScale(0)))
        .y1((d) => yScale(d[key]))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(parsedData)
        .attr("d", areaGen)
        .attr("fill", seriesInfo.color)
        .attr("opacity", 0.08);
    }

    // Lines with entrance animation
    CHART_SERIES.forEach((series) => {
      const lineGen = d3
        .line<(typeof parsedData)[0]>()
        .x((d) => xScale(d.dateObj))
        .y((d) => yScale(d[series.key]))
        .curve(d3.curveMonotoneX);

      const path = g
        .append("path")
        .datum(parsedData)
        .attr("d", lineGen)
        .attr("fill", "none")
        .attr("stroke", series.color)
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round");

      // Animate line drawing
      const pathNode = path.node() as SVGPathElement;
      const totalLength = pathNode.getTotalLength();
      path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);

      // Data dots
      g.selectAll(`.dot-${series.key}`)
        .data(parsedData)
        .enter()
        .append("circle")
        .attr("class", `dot-${series.key}`)
        .attr("cx", (d) => xScale(d.dateObj))
        .attr("cy", (d) => yScale(d[series.key]))
        .attr("r", 3.5)
        .attr("fill", series.color)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0)
        .transition()
        .delay(800)
        .duration(300)
        .attr("opacity", 1);
    });

    // Y-axis labels
    g.selectAll(".y-label")
      .data(yTicks)
      .enter()
      .append("text")
      .attr("x", -8)
      .attr("y", (d) => yScale(d) + 4)
      .attr("text-anchor", "end")
      .attr("fill", "#6b7280")
      .attr("font-size", "11px")
      .text((d) => d);

    // X-axis ticks
    const xTicks = xScale.ticks(d3.timeMonth.every(3)!);
    g.selectAll(".x-label")
      .data(xTicks)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d))
      .attr("y", h + 24)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280")
      .attr("font-size", "11px")
      .text((d) => d3.timeFormat("%b %y")(d));

    // X-axis tick marks
    g.selectAll(".x-tick")
      .data(xTicks)
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", h)
      .attr("y2", h + 4)
      .attr("stroke", "#d1d5db");

    // Hover interaction
    const hoverG = g.append("g").style("display", "none");

    hoverG
      .append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", h)
      .attr("stroke", "#9ca3af")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    const bisect = d3.bisector<(typeof parsedData)[0], Date>(
      (d) => d.dateObj,
    ).left;

    svg
      .append("rect")
      .attr("x", CHART_MARGIN.left)
      .attr("y", CHART_MARGIN.top)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event, this);
        const x0 = xScale.invert(mx - CHART_MARGIN.left);
        let idx = bisect(parsedData, x0, 1);
        idx = Math.min(idx, parsedData.length - 1);
        const d0 = parsedData[idx - 1];
        const d1 = parsedData[idx];
        if (!d0 && !d1) return;
        const closest =
          !d0
            ? d1
            : !d1
              ? d0
              : x0.getTime() - d0.dateObj.getTime() >
                  d1.dateObj.getTime() - x0.getTime()
                ? d1
                : d0;

        const cx = xScale(closest.dateObj);
        hoverG.style("display", null);
        hoverG.select(".hover-line").attr("x1", cx).attr("x2", cx);

        // Highlight closest dots
        CHART_SERIES.forEach((series) => {
          g.selectAll<SVGCircleElement, (typeof parsedData)[0]>(
            `.dot-${series.key}`,
          ).attr("r", (d) =>
            d.dateObj.getTime() === closest.dateObj.getTime() ? 5 : 3.5,
          );
        });

        const svgRect = svgRef.current!.getBoundingClientRect();
        setTooltip({
          x: svgRect.left + CHART_MARGIN.left + cx,
          y: svgRect.top + CHART_MARGIN.top,
          date: closest.dateObj,
          values: CHART_SERIES.map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
            value: closest[s.key],
          })),
        });
      })
      .on("mouseleave", () => {
        hoverG.style("display", "none");
        CHART_SERIES.forEach((series) => {
          g.selectAll(`.dot-${series.key}`).attr("r", 3.5);
        });
        setTooltip(null);
      });
  }, [containerWidth, parsedData]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <Card className="gap-0 p-0 rounded-xl overflow-hidden">
      {/* Title + Range filter */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <ChartLine size={18} className="text-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            Historical Trends
          </h2>
        </div>
        <div className="flex border rounded-lg overflow-hidden">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setActiveRange(range.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0",
                activeRange === range.value
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div
        ref={containerRef}
        className="relative px-2 pb-2"
        role="img"
        aria-label="Historical trends chart showing LDL, Total Cholesterol, HDL, and ApoB levels over time"
      >
        <svg ref={svgRef} className="block w-full" />
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none -translate-x-1/2"
            style={{ left: tooltip.x, top: tooltip.y - 8 }}
          >
            <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-xs">
              <p className="font-medium text-foreground mb-1">
                {d3.timeFormat("%b %d, %Y")(tooltip.date)}
              </p>
              {tooltip.values.map((v) => (
                <div key={v.key} className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: v.color }}
                  />
                  <span className="text-muted-foreground">{v.label}:</span>
                  <span className="font-medium text-foreground">
                    {v.value} mg/dL
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-4 pb-4 text-xs">
        {CHART_SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-muted-foreground">{s.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-green-500/15 shrink-0" />
          <span className="text-muted-foreground">Optimal zone</span>
        </div>
      </div>
    </Card>
  );
}

// ─── Skeleton Loading State ─────────────────────────────────────────────────

function LipidPanelSkeleton() {
  return (
    <div className="p-2 pb-8 flex flex-col gap-4">
      {/* Breadcrumbs */}
      <Skeleton className="h-5 w-64" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>

      {/* Summary card */}
      <Skeleton className="h-[380px] w-full rounded-xl" />

      {/* Quick metrics */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[89px] rounded-xl" />
        ))}
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-xl" />
        ))}
      </div>

      {/* Chart */}
      <Skeleton className="h-[420px] w-full rounded-xl" />
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function LipidPanelPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LipidPanelSkeleton />;

  return (
    <div className="p-2 pb-8 flex flex-col gap-4">
      <HeaderSection />
      <SummaryCard />

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {QUICK_METRICS.map((m) => (
          <QuickMetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Bottom Cards: All Parameters + Genetic Variants + Recommendations */}
      <div className="grid grid-cols-3 gap-4">
        <AllParametersCard />
        <GeneticVariantsCard />
        <RecommendationsCard />
      </div>

      {/* Historical Trends Chart */}
      <HistoricalTrendsChart />
    </div>
  );
}
