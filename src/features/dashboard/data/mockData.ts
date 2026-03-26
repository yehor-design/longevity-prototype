// Mock data for the Dashboard — all data is fictional for prototype purposes.

export interface CardioMetric {
  label: string;
  value: number;
  unit: string;
  description: string;
  optimal: string;
  status: "normal" | "borderline";
  /** 0–100 percent for progress bar */
  progress: number;
}

export interface CardioRiskData {
  riskPercent: number;
  trend: string;
  chartPoints: { month: string; value: number }[];
  metrics: CardioMetric[];
}

export const cardioRiskData: CardioRiskData = {
  riskPercent: 12,
  trend: "↓ 6% in 9 months",
  chartPoints: [
    { month: "Jul", value: 22 },
    { month: "", value: 32 },
    { month: "", value: 20 },
    { month: "", value: 23 },
    { month: "", value: 25 },
    { month: "Sep", value: 15 },
    { month: "", value: 13 },
    { month: "", value: 24 },
    { month: "", value: 20 },
    { month: "Jan", value: 27 },
  ],
  metrics: [
    {
      label: "Blood Pressure",
      value: 118,
      unit: "mmHg",
      description: "Systolic within optimal range",
      optimal: "Optimal: < 120",
      status: "normal",
      progress: 87,
    },
    {
      label: "LDL Cholesterol",
      value: 92,
      unit: "mg/dL",
      description: "Below recommended threshold",
      optimal: "Optimal: < 100",
      status: "normal",
      progress: 100,
    },
    {
      label: "Resting HR",
      value: 62,
      unit: "bpm",
      description: "Athletic-range heart rate",
      optimal: "Optimal: 60–100",
      status: "normal",
      progress: 100,
    },
    {
      label: "Triglycerides",
      value: 145,
      unit: "mg/dL",
      description: "Borderline — lifestyle changes advised",
      optimal: "Optimal: < 150",
      status: "borderline",
      progress: 73,
    },
  ],
};

export interface DnaInsight {
  id: string;
  title: string;
  description: string;
  severity: "high" | "moderate" | "info";
}

export interface DnaInsightsData {
  hasHighRisk: boolean;
  insights: DnaInsight[];
}

export const dnaInsightsData: DnaInsightsData = {
  hasHighRisk: true,
  insights: [
    {
      id: "apoe4",
      title: "ApoE4 Allele Present",
      description:
        "Elevated genetic risk for metabolic decline. Early intervention recommended.",
      severity: "high",
    },
    {
      id: "mthfr",
      title: "Methylation Efficiency",
      description:
        "MTHFR variant detected: Optimal folate processing (CC variant).",
      severity: "info",
    },
    {
      id: "cyp2d6",
      title: "CYP2D6 — Slow Metabolizer",
      description:
        "Reduced drug metabolism rate. Dosage adjustments may be needed for certain medications.",
      severity: "moderate",
    },
  ],
};

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "moderate" | "low";
  tags: { label: string; type: "priority" | "category" }[];
}

export const recommendationsData: Recommendation[] = [
  {
    id: "ldl-apob",
    title: "Address elevated LDL & ApoB",
    description:
      "Your LDL (160 mg/dL) and ApoB (125 mg/dL) are above optimal. Discuss lipid-lowering strategies with your provider.",
    priority: "high",
    tags: [
      { label: "Hight Priority", type: "priority" },
      { label: "Lipid Panel", type: "category" },
    ],
  },
  {
    id: "vitamin-d",
    title: "Supplement Vitamin D",
    description:
      "At 18 ng/mL your Vitamin D is deficient. Consider 2,000–4,000 IU daily and 15–20 min of sun exposure.",
    priority: "high",
    tags: [
      { label: "Hight Priority", type: "priority" },
      { label: "Vitamin D Panel", type: "category" },
    ],
  },
  {
    id: "glucose",
    title: "Monitor fasting glucose",
    description:
      "Fasting glucose of 102 mg/dL is borderline pre-diabetic. Reduce refined carbs, increase fiber, and re-test in 3 months.",
    priority: "moderate",
    tags: [
      { label: "Moderate", type: "priority" },
      { label: "Biochem Profile", type: "category" },
    ],
  },
];

export type TestStatus = "normal" | "suboptimal" | "borderline";

export interface SubMetric {
  label: string;
  value: string;
  unit?: string;
  flag?: "up" | "down" | "warning" | "ok";
}

export interface BloodTest {
  id: string;
  name: string;
  date: string;
  status: TestStatus;
  /** Primary metric */
  primaryLabel: string;
  primaryValue: string;
  primaryUnit: string;
  /** Optional trend note */
  trend?: string;
  /** Sparkline data (0-100) */
  sparkline: number[];
  /** Sub-metric rows */
  subMetrics: SubMetric[];
}

export const bloodTestsData: BloodTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    date: "MAR 8, 2026",
    status: "normal",
    primaryLabel: "Hemoglobin",
    primaryValue: "5.2",
    primaryUnit: "mmol/L",
    trend: "— Stable over 6mo",
    sparkline: [40, 42, 45, 48, 50, 52, 51, 50, 52, 53],
    subMetrics: [
      { label: "WBC", value: "6.2", unit: "×10³/µL", flag: "ok" },
      { label: "HGB", value: "14.1", unit: "g/dL", flag: "ok" },
      { label: "HCT", value: "42.3", unit: "%", flag: "ok" },
      { label: "PLT", value: "245", unit: "×10³/µL", flag: "ok" },
    ],
  },
  {
    id: "lipid",
    name: "Lipid Panel + ApoB",
    date: "MAR 8, 2026",
    status: "suboptimal",
    primaryLabel: "LDL Cholesterol",
    primaryValue: "160",
    primaryUnit: "mg/dL",
    trend: "↗ +12 from last test",
    sparkline: [30, 35, 40, 50, 55, 60, 65, 70, 75, 80],
    subMetrics: [
      { label: "Total Chol", value: "230", unit: "mg/dL", flag: "up" },
      { label: "LDL", value: "160", unit: "mg/dL", flag: "up" },
      { label: "HDL", value: "45", unit: "mg/dL", flag: "warning" },
      { label: "TG", value: "140", unit: "mg/dL", flag: "ok" },
      { label: "ApoB", value: "125", unit: "mg/dL", flag: "up" },
    ],
  },
  {
    id: "biochem",
    name: "Basic Biochemical Profile",
    date: "MAR 8, 2026",
    status: "borderline",
    primaryLabel: "Fasting Glucose",
    primaryValue: "102",
    primaryUnit: "mg/dL",
    trend: "↗ +4 from last test",
    sparkline: [45, 48, 50, 55, 58, 60, 62, 65, 68, 70],
    subMetrics: [
      { label: "Glucose", value: "102", unit: "mg/dL", flag: "warning" },
      { label: "Creatinine", value: "0.95", unit: "mg/dL", flag: "ok" },
      { label: "ALT", value: "38", unit: "U/L", flag: "ok" },
      { label: "BUN", value: "16", unit: "mg/dL", flag: "ok" },
    ],
  },
  {
    id: "psa",
    name: "PSA (Prostate-Specific Antigen)",
    date: "MAR 8, 2026",
    status: "normal",
    primaryLabel: "Total PSA",
    primaryValue: "0.8",
    primaryUnit: "ng/mL",
    trend: "— Within normal range",
    sparkline: [50, 48, 50, 49, 50, 50, 49, 50, 50, 50],
    subMetrics: [
      { label: "Total PSA", value: "0.8", unit: "ng/mL", flag: "ok" },
      { label: "Free PSA", value: "0.3", unit: "ng/mL", flag: "ok" },
    ],
  },
  {
    id: "vitd",
    name: "Vitamin D (25-Hydroxy)",
    date: "MAR 8, 2026",
    status: "suboptimal",
    primaryLabel: "25-Hydroxy Vit D",
    primaryValue: "18",
    primaryUnit: "ng/mL",
    trend: "↘ -7 from summer peak",
    sparkline: [80, 75, 70, 60, 50, 40, 35, 30, 25, 20],
    subMetrics: [
      { label: "Vitamin D", value: "18", unit: "ng/mL", flag: "down" },
      { label: "Optimal", value: "30–60", unit: "ng/mL", flag: "ok" },
    ],
  },
  {
    id: "urinalysis",
    name: "Urinalysis",
    date: "MAR 8, 2026",
    status: "normal",
    primaryLabel: "pH Level",
    primaryValue: "6.0",
    primaryUnit: "",
    trend: "— All markers normal",
    sparkline: [50, 50, 52, 50, 51, 50, 50, 49, 50, 50],
    subMetrics: [
      { label: "Protein", value: "Negative", flag: "ok" },
      { label: "Glucose", value: "Negative", flag: "ok" },
      { label: "pH", value: "6.0", flag: "ok" },
      { label: "Sp. Gravity", value: "1.020", flag: "ok" },
    ],
  },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export const chatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "What can I do today to improve my glucose levels?",
    timestamp: "9:41 AM",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Great question! I've added a <strong>15-min HIIT session</strong> to your daily plan — it can boost insulin sensitivity by up to 40% for the next 24 hours. Also try a <strong>10-min walk after lunch</strong> to reduce post-meal glucose spikes by ~30%.",
  },
];

export const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: "q1",
    text: "How does my ApoE4 variant affect glucose metabolism?",
  },
  {
    id: "q2",
    text: "Should I worry about my triglyceride level at 145?",
  },
  {
    id: "q3",
    text: "Is my Vitamin D level okay for someone with my DNA profile?",
  },
  {
    id: "q4",
    text: "How is my cardiovascular risk trending over time?",
  },
];
