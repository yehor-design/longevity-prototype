import { useRef, useState, useEffect } from "react";
import { Shield, Heart, Activity, Droplets } from "lucide-react";
import { motion, useInView } from "framer-motion";
import * as d3 from "d3";
import { Badge } from "@/components/ui/badge";
import { cardioRiskData, type CardioMetric } from "../data/mockData";

// ─── Icon map ──────────────────────────────────────────────────────────────────

const METRIC_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "Blood Pressure": Heart,
  "LDL Cholesterol": Droplets,
  "Resting HR": Activity,
  Triglycerides: Droplets,
};

// ─── Chart constants ───────────────────────────────────────────────────────────

const CHART_DATA = [
  { idx: 0, value: 22, month: "Jul" },
  { idx: 1, value: 32, month: "" },
  { idx: 2, value: 20, month: "" },
  { idx: 3, value: 23, month: "" },
  { idx: 4, value: 25, month: "" },
  { idx: 5, value: 15, month: "" },
  { idx: 6, value: 13, month: "" },
  { idx: 7, value: 24, month: "" },
  { idx: 8, value: 20, month: "" },
  { idx: 9, value: 27, month: "Jan" },
];

const X_LABELS = [
  { idx: 0, label: "Jul" },
  { idx: 3.3, label: "Aug" },
  { idx: 6.6, label: "Sep" },
  { idx: 9, label: "Jan" },
];

const Y_TICKS = [32, 24, 16, 12, 8];
const Y_MIN = 8;
const Y_MAX = 32;
const ML = 26; // margin left for y-axis labels
const MB = 18; // margin bottom for x-axis labels
const CH = 88; // chart inner height

// ─── Heartbeat background ──────────────────────────────────────────────────────

function HeartbeatBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf: number;
    let offset = 0;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    init();

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const segW = 130;
      const base = h * 0.58;
      const amp = h * 0.52;

      ctx.beginPath();
      ctx.moveTo(-segW, base);

      for (let x = -(segW - (offset % segW)); x < w + segW; x += segW) {
        // flat
        ctx.lineTo(x + 12, base);
        // P wave
        ctx.bezierCurveTo(x + 16, base, x + 20, base - amp * 0.22, x + 24, base - amp * 0.26);
        ctx.bezierCurveTo(x + 28, base - amp * 0.22, x + 32, base, x + 36, base);
        // PQ flat
        ctx.lineTo(x + 40, base);
        // Q dip
        ctx.lineTo(x + 42, base + amp * 0.1);
        // R spike
        ctx.lineTo(x + 45, base - amp);
        // S dip
        ctx.lineTo(x + 48, base + amp * 0.22);
        // ST
        ctx.lineTo(x + 52, base);
        // T wave
        ctx.bezierCurveTo(x + 58, base, x + 62, base - amp * 0.38, x + 69, base - amp * 0.4);
        ctx.bezierCurveTo(x + 76, base - amp * 0.38, x + 82, base, x + 88, base);
        // TP flat
        ctx.lineTo(x + segW, base);
      }

      ctx.strokeStyle = "rgba(34,197,94,0.2)";
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      offset += 0.7;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ height: 72 }}
    />
  );
}

// ─── D3 Risk Chart ─────────────────────────────────────────────────────────────

interface TooltipState {
  screenX: number;
  screenY: number;
  value: number;
  month: string;
}

function D3RiskChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Outer/inner dot selections stored as SVG element refs
  const dotOuterRef = useRef<SVGCircleElement[]>([]);
  const dotInnerRef = useRef<SVGCircleElement[]>([]);

  // Animate dots on hover
  useEffect(() => {
    dotOuterRef.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("r", hoveredIdx === i ? "7" : "4");
    });
    dotInnerRef.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("r", hoveredIdx === i ? "3.5" : "2.5");
    });
  }, [hoveredIdx]);

  useEffect(() => {
    if (!isInView || !svgRef.current) return;

    const svgEl = svgRef.current;
    const totalW = svgEl.getBoundingClientRect().width || 300;
    const chartW = totalW - ML;
    const totalH = CH + MB;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    dotOuterRef.current = [];
    dotInnerRef.current = [];

    const xScale = d3.scaleLinear().domain([0, 9]).range([0, chartW]);
    const yScale = d3.scaleLinear().domain([Y_MIN, Y_MAX]).range([CH, 0]);

    const lineGen = d3
      .line<(typeof CHART_DATA)[0]>()
      .x((d) => xScale(d.idx))
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGen = d3
      .area<(typeof CHART_DATA)[0]>()
      .x((d) => xScale(d.idx))
      .y0(CH)
      .y1((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const defs = svg.append("defs");

    // Area gradient
    const grad = defs
      .append("linearGradient")
      .attr("id", "cv-area-grad")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    grad
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0.3);
    grad
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0);

    // Clip path for draw-on animation
    const clipRect = defs
      .append("clipPath")
      .attr("id", "cv-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", -4)
      .attr("width", 0)
      .attr("height", totalH + 8);

    const g = svg.append("g").attr("transform", `translate(${ML}, 0)`);

    // Y-axis grid lines + labels
    Y_TICKS.forEach((tick) => {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", chartW)
        .attr("y1", yScale(tick))
        .attr("y2", yScale(tick))
        .attr("stroke", "rgba(255,255,255,0.1)")
        .attr("stroke-width", 0.5);

      svg
        .append("text")
        .attr("x", ML - 4)
        .attr("y", yScale(tick) + 3.5)
        .attr("text-anchor", "end")
        .attr("fill", "rgba(255,255,255,0.4)")
        .style("font-size", "9px")
        .style("font-family", "Inter, sans-serif")
        .text(`${tick}%`);
    });

    // X-axis labels
    X_LABELS.forEach(({ idx, label }) => {
      svg
        .append("text")
        .attr("x", ML + xScale(idx))
        .attr("y", CH + MB - 2)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(255,255,255,0.4)")
        .style("font-size", "9px")
        .style("font-family", "Inter, sans-serif")
        .text(label);
    });

    // Hover guide line
    const guideLine = g
      .append("line")
      .attr("y1", 0)
      .attr("y2", CH)
      .attr("stroke", "rgba(34,197,94,0.35)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0);

    // Area fill
    const areaPath = g
      .append("path")
      .datum(CHART_DATA)
      .attr("d", areaGen)
      .attr("fill", "url(#cv-area-grad)")
      .attr("clip-path", "url(#cv-clip)")
      .attr("opacity", 0);

    // Line
    g.append("path")
      .datum(CHART_DATA)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2)
      .attr("clip-path", "url(#cv-clip)");

    // Dots (hidden until line finishes)
    const dotsG = g.append("g").attr("opacity", 0);
    CHART_DATA.forEach((d, i) => {
      const outer = dotsG
        .append("circle")
        .attr("cx", xScale(d.idx))
        .attr("cy", yScale(d.value))
        .attr("r", 4)
        .attr("fill", "rgba(34,197,94,0.2)")
        .style("transition", "r 0.15s ease")
        .node();
      if (outer) dotOuterRef.current[i] = outer;

      const inner = dotsG
        .append("circle")
        .attr("cx", xScale(d.idx))
        .attr("cy", yScale(d.value))
        .attr("r", 2.5)
        .attr("fill", "#22c55e")
        .style("transition", "r 0.15s ease")
        .node();
      if (inner) dotInnerRef.current[i] = inner;
    });

    // Mouse interaction overlay
    g.append("rect")
      .attr("width", chartW)
      .attr("height", CH)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event, this);
        const ni = Math.max(
          0,
          Math.min(CHART_DATA.length - 1, Math.round(xScale.invert(mx)))
        );
        const d = CHART_DATA[ni];
        const px = xScale(d.idx);
        const py = yScale(d.value);

        guideLine.attr("x1", px).attr("x2", px).attr("opacity", 1);
        setHoveredIdx(ni);

        const rect = svgEl.getBoundingClientRect();
        setTooltip({
          screenX: rect.left + ML + px,
          screenY: rect.top + py,
          value: d.value,
          month: d.month,
        });
      })
      .on("mouseleave", () => {
        guideLine.attr("opacity", 0);
        setTooltip(null);
        setHoveredIdx(null);
      });

    // Entrance animation: draw line left→right
    let startTs: number | null = null;
    let raf: number;
    const duration = 1400;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      clipRect.attr("width", eased * chartW);
      if (t > 0.55) areaPath.attr("opacity", Math.min((t - 0.55) / 0.3, 0.9));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        dotsG.transition().duration(350).attr("opacity", 1);
      }
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [isInView]);

  return (
    <div ref={containerRef} className="relative">
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2"
          style={{ left: tooltip.screenX, top: tooltip.screenY - 36 }}
        >
          <div className="bg-[#0d2a1d] border border-[#22c55e]/30 rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
            <span className="text-xs font-semibold text-[#22c55e]">
              {tooltip.value}%
            </span>
            {tooltip.month && (
              <span className="text-[10px] text-white/40 ml-1">
                {tooltip.month}
              </span>
            )}
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        style={{ width: "100%", height: CH + MB, overflow: "visible" }}
        className="cursor-crosshair"
      />
    </div>
  );
}

// ─── Mini Metric Card ──────────────────────────────────────────────────────────

function MiniMetricCard({
  metric,
  delay,
}: {
  metric: CardioMetric;
  delay: number;
}) {
  const Icon = METRIC_ICONS[metric.label] ?? Heart;
  const isNormal = metric.status === "normal";
  const color = isNormal ? "#22c55e" : "#f59e0b";
  const cardBg = isNormal
    ? "bg-[rgba(255,255,255,0.06)]"
    : "bg-[rgba(245,158,11,0.12)]";

  return (
    <motion.div
      className={`flex flex-col gap-2 rounded-2xl p-3 backdrop-blur-sm ${cardBg}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Icon size={14} className="text-white/50" />
          <span className="text-xs font-medium text-white/50">
            {metric.label}
          </span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xs font-medium text-white/80">
            {metric.value}
          </span>
          <span className="text-[10px] text-white/30">{metric.unit}</span>
        </div>
      </div>

      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${metric.progress}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] leading-3 text-white/35">
          {metric.description}
        </span>
        <span className="text-xs font-medium" style={{ color }}>
          {metric.optimal}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Card ─────────────────────────────────────────────────────────────────

export function CardiovascularRiskCard() {
  const { riskPercent, trend, metrics } = cardioRiskData;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(152.762deg, rgb(7,18,16) 8.49%, rgb(10,31,23) 37.55%, rgb(13,42,29) 62.45%, rgb(15,31,24) 91.51%)",
      }}
    >
      {/* Animated ECG background */}
      <HeartbeatBackground />

      {/* Header */}
      <motion.div
        className="relative flex items-center justify-between px-4 pt-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-6 rounded-[10px] bg-green-500/[0.12]">
            <Shield size={12} className="text-green-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[1px] text-[rgba(0,212,146,0.6)]">
            Cardiovascular Risk
          </span>
        </div>
        <Badge variant="success-glass" className="uppercase tracking-wide">
          <Shield />
          Low Risk
        </Badge>
      </motion.div>

      {/* Score + trend */}
      <motion.div
        className="relative flex items-end justify-between px-4 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="flex items-baseline gap-0.5">
          <span className="text-[32px] font-normal text-white leading-8 tracking-[-0.44px]">
            {riskPercent}
          </span>
          <span className="text-sm font-bold text-[#00d492]">%</span>
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-white/25 ml-1">
            10-Year Risk Score
          </span>
        </div>
        <Badge variant="success-glass">
          {trend}
        </Badge>
      </motion.div>

      {/* D3 Chart */}
      <div className="relative px-4 mt-2">
        <D3RiskChart />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2 p-2 mt-auto">
        {metrics.map((m, i) => (
          <MiniMetricCard key={m.label} metric={m} delay={1.2 + i * 0.08} />
        ))}
      </div>
    </div>
  );
}
