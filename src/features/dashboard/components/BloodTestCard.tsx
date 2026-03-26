import { useRef, useState, useEffect, useId } from "react";
import {
  ArrowRight,
  Droplets,
  Heart,
  FlaskConical,
  TestTube,
  Microscope,
  Beaker,
} from "lucide-react";
import { useInView } from "framer-motion";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BloodTest, SubMetric, TestStatus } from "../data/mockData";
import { cn } from "@/lib/utils";

// ─── Config ────────────────────────────────────────────────────────────────────

const testIcons: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  cbc: Microscope,
  lipid: Heart,
  biochem: FlaskConical,
  psa: TestTube,
  vitd: Droplets,
  urinalysis: Beaker,
};

const statusConfig: Record<
  TestStatus,
  { label: string; color: string }
> = {
  normal:     { label: "Normal",     color: "#22c55e" },
  suboptimal: { label: "Suboptimal", color: "#f59e0b" },
  borderline: { label: "Borderline", color: "#ef4444" },
};

const statusBadgeVariant: Record<TestStatus, "success" | "warning" | "danger"> = {
  normal:     "success",
  suboptimal: "warning",
  borderline: "danger",
};

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TestStatus }) {
  return (
    <Badge variant={statusBadgeVariant[status]}>
      {statusConfig[status].label}
    </Badge>
  );
}

// ─── D3 Sparkline ──────────────────────────────────────────────────────────────

interface SparkTooltip {
  screenX: number;
  screenY: number;
  value: number;
}

function D3Sparkline({ data, status }: { data: number[]; status: TestStatus }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, margin: "-20px" });
  const uid = useId().replace(/:/g, "");
  const [tooltip, setTooltip] = useState<SparkTooltip | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  const color = statusConfig[status].color;

  useEffect(() => {
    if (!isInView || !svgRef.current) return;

    const svgEl = svgRef.current;
    const W = svgEl.getBoundingClientRect().width || 96;
    const H = 32;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    dotRef.current = null;

    // Scales — pad y so flat lines still show
    const lo = Math.min(...data);
    const hi = Math.max(...data);
    const pad = Math.max((hi - lo) * 0.25, 3);
    const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([0, W]);
    const yScale = d3.scaleLinear().domain([lo - pad, hi + pad]).range([H - 2, 2]);

    const lineGen = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGen = d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(H)
      .y1((d) => yScale(d))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const defs = svg.append("defs");

    // Unique gradient per instance
    const grad = defs
      .append("linearGradient")
      .attr("id", `${uid}-g`)
      .attr("x1", "0").attr("y1", "0")
      .attr("x2", "0").attr("y2", "1");
    grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.22);
    grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0);

    // Clip path for draw-on animation
    const clipRect = defs
      .append("clipPath")
      .attr("id", `${uid}-c`)
      .append("rect")
      .attr("x", 0).attr("y", -4)
      .attr("width", 0).attr("height", H + 8);

    // Area fill
    svg.append("path")
      .datum(data)
      .attr("d", areaGen)
      .attr("fill", `url(#${uid}-g)`)
      .attr("clip-path", `url(#${uid}-c)`);

    // Line
    svg.append("path")
      .datum(data)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("stroke-linecap", "round")
      .attr("clip-path", `url(#${uid}-c)`);

    // Hover dot (hidden by default)
    const dot = svg
      .append("circle")
      .attr("r", 3)
      .attr("fill", color)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .attr("pointer-events", "none")
      .node();
    dotRef.current = dot;

    // Invisible overlay for mouse events
    svg
      .append("rect")
      .attr("width", W)
      .attr("height", H)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event, this);
        const ni = Math.max(
          0,
          Math.min(data.length - 1, Math.round(xScale.invert(mx)))
        );
        const px = xScale(ni);
        const py = yScale(data[ni]);

        d3.select(dot).attr("cx", px).attr("cy", py).attr("opacity", 1);

        const rect = svgEl.getBoundingClientRect();
        setTooltip({ screenX: rect.left + px, screenY: rect.top + py, value: data[ni] });
      })
      .on("mouseleave", () => {
        d3.select(dot).attr("opacity", 0);
        setTooltip(null);
      });

    // Draw-on entrance animation
    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / 900, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      clipRect.attr("width", eased * W);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, data, color, uid]);

  return (
    <div ref={wrapRef} className="relative w-full">
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.screenX, top: tooltip.screenY - 6 }}
        >
          <div
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold shadow-md whitespace-nowrap border"
            style={{
              color,
              background: "var(--card)",
              borderColor: `${color}40`,
            }}
          >
            {tooltip.value}
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        className="w-full h-8"
        style={{ overflow: "visible" }}
      />
    </div>
  );
}

// ─── Flag icon ──────────────────────────────────────────────────────────────────

function FlagIcon({ flag }: { flag?: SubMetric["flag"] }) {
  if (!flag || flag === "ok")      return <span className="text-emerald-500 text-xs">✓</span>;
  if (flag === "up")               return <span className="text-red-500 text-xs">↑</span>;
  if (flag === "down")             return <span className="text-blue-500 text-xs">↓</span>;
  return <span className="text-amber-500 text-xs">▲</span>;
}

// ─── Blood Test Card ───────────────────────────────────────────────────────────

export function BloodTestCard({ test }: { test: BloodTest }) {
  const Icon = testIcons[test.id] ?? FlaskConical;
  const trendColor =
    test.status === "normal"
      ? "text-muted-foreground"
      : test.status === "suboptimal"
        ? "text-amber-600"
        : "text-red-600";

  return (
    <Card className="flex flex-col rounded-2xl border-border shadow-sm p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center size-6 rounded-full bg-muted shrink-0">
            <Icon size={14} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">
              {test.name}
            </span>
            <span className="text-[10px] text-muted-foreground">{test.date}</span>
          </div>
        </div>
        <StatusBadge status={test.status} />
      </div>

      {/* Primary metric + D3 sparkline */}
      <div className="px-4 pb-2">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">
              {test.primaryLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-foreground leading-7">
                {test.primaryValue}
              </span>
              <span className="text-xs text-muted-foreground">
                {test.primaryUnit}
              </span>
            </div>
            {test.trend && (
              <span className={cn("text-[10px] mt-0.5", trendColor)}>
                {test.trend}
              </span>
            )}
          </div>
          <div className="w-24 shrink-0 ml-2">
            <D3Sparkline data={test.sparkline} status={test.status} />
          </div>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="px-4 pb-3 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {test.subMetrics.map((sm) => (
            <div
              key={sm.label}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="text-muted-foreground">{sm.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{sm.value}</span>
                {sm.unit && (
                  <span className="text-muted-foreground">{sm.unit}</span>
                )}
                <FlagIcon flag={sm.flag} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 mt-auto">
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View Full Results
          <ArrowRight size={12} />
        </button>
      </div>
    </Card>
  );
}
