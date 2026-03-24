import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";

// ── Figma asset URLs ────────────────────────────────────────────────────────
const A = {
  heroBg: "https://www.figma.com/api/mcp/asset/44f2ee68-2202-4040-b319-c6b38b4a6096",
  logoBadge: "https://www.figma.com/api/mcp/asset/2e3e19e2-0547-4bbe-aca9-17e6cf99ced4",
  secureIcon: "https://www.figma.com/api/mcp/asset/50d3a418-8af3-4b0f-90de-25c44d6f694b",
  aiIcon: "https://www.figma.com/api/mcp/asset/f9d0d882-0678-4c21-a836-65e96af606e2",
  // Google icon parts
  googleBlue: "https://www.figma.com/api/mcp/asset/d8e111e4-16b8-49c0-ac3e-d09c324b3064",
  googleGreen: "https://www.figma.com/api/mcp/asset/2c2927a9-302b-4749-a94b-8b1da60ec3bb",
  googleRed: "https://www.figma.com/api/mcp/asset/29d554b2-65ad-4760-b0f4-92f37a319cb6",
  googleYellow: "https://www.figma.com/api/mcp/asset/3a3da08a-44b3-47df-a26b-ee84c9f0c68c",
  // Heart Rate card
  heartIcon: "https://www.figma.com/api/mcp/asset/5ce4bd3b-1f65-4a20-ac3e-fc2768c1e4d3",
  hrChevron: "https://www.figma.com/api/mcp/asset/7c31814e-f5a1-440c-99c7-bde6ca3d7112",
  hrChartBg: "https://www.figma.com/api/mcp/asset/a9b5a0d4-dd78-442a-9298-2850903f6f32",
  hrChartLine: "https://www.figma.com/api/mcp/asset/e1d4700a-962e-4432-8577-60ed3b5ca2db",
  // Hydration card
  waterIcon: "https://www.figma.com/api/mcp/asset/55cc8265-e9c5-47e8-bbaa-96270d3a580e",
  hydChevron: "https://www.figma.com/api/mcp/asset/0afdb29b-3970-4a2a-870b-3cda6758586b",
  barFull: "https://www.figma.com/api/mcp/asset/cee4d955-2180-4044-b0ae-cb4b939b7b94",
  bar67: "https://www.figma.com/api/mcp/asset/670ea491-3f40-4545-8c66-6ba3df7228db",
  bar52: "https://www.figma.com/api/mcp/asset/559ffbc2-3b4d-4fa5-962c-4ccc1d9e8c16",
  bar75: "https://www.figma.com/api/mcp/asset/a1b122c7-9e12-4801-862c-4e76f61450f5",
  bar87: "https://www.figma.com/api/mcp/asset/87d589d3-a61a-4839-95e3-07437815fcc4",
  bar60: "https://www.figma.com/api/mcp/asset/7e6e8fe2-7942-4d79-8cc6-9ddefdb02f10",
  // Blood Pressure card
  bpIcon: "https://www.figma.com/api/mcp/asset/dca7879a-a406-4db2-a0d4-12030e1c5088",
  bpChevron: "https://www.figma.com/api/mcp/asset/35f267c6-9d34-4668-b60a-b5bda82429e2",
  checkBg: "https://www.figma.com/api/mcp/asset/004f5c6a-eae4-4731-ba88-4e7b8cc01742",
  checkMark: "https://www.figma.com/api/mcp/asset/35f8df43-f0f1-47ae-b82d-9912e083733e",
  // Tension Headache card
  thIcon: "https://www.figma.com/api/mcp/asset/806618ae-a1db-463c-83f5-3b6e1ef4c580",
  thChevron: "https://www.figma.com/api/mcp/asset/c7aea683-ea73-48f2-a8a1-e05f93f7c72c",
  sparkle: "https://www.figma.com/api/mcp/asset/71e64f32-2fc2-4c72-8c7b-e3286300af06",
};

// ── Heart Rate floating card ─────────────────────────────────────────────────
function HeartRateCard() {
  return (
    <div
      className="bg-white flex flex-col items-end overflow-hidden"
      style={{
        width: "351.3px",
        borderRadius: "32.58px",
        padding: "16.29px 18.33px",
        gap: "24.44px",
        boxShadow:
          "0px 5.43px 10.86px 0px rgba(15,23,42,0.03), 0px 10.86px 21.72px 0px rgba(15,23,42,0.02)",
      }}
    >
      <div className="flex items-center w-full" style={{ gap: "16.29px" }}>
        <div className="flex flex-1 items-center" style={{ gap: "6.11px" }}>
          <div className="relative shrink-0" style={{ width: "21.72px", height: "21.72px" }}>
            <div
              className="absolute"
              style={{ inset: "12.71% 8.54% 15.95% 8.54%" }}
            >
              <img alt="" className="absolute block max-w-none size-full" src={A.heartIcon} />
            </div>
          </div>
          <span
            className="font-bold text-[#1f2937]"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16.29px",
              lineHeight: "21.72px",
              letterSpacing: "-0.08px",
            }}
          >
            Heart Rate
          </span>
        </div>
        <div className="flex items-center shrink-0" style={{ gap: "4.07px" }}>
          <span
            className="text-[#4b5563]"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16.29px",
              lineHeight: "21.72px",
              letterSpacing: "-0.08px",
            }}
          >
            Today
          </span>
          <div className="relative shrink-0" style={{ width: "21.72px", height: "21.72px" }}>
            <div className="absolute" style={{ inset: "12.5% 31.9% 12.5% 33.33%" }}>
              <img alt="" className="absolute block max-w-none size-full" src={A.hrChevron} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full" style={{ gap: "12.22px" }}>
        <div className="flex flex-1 flex-col" style={{ gap: "4.07px" }}>
          <div className="flex items-end" style={{ gap: "2.04px" }}>
            <span
              className="font-bold text-[#1f2937] shrink-0"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "24.44px",
                lineHeight: "32.58px",
                letterSpacing: "-0.2px",
              }}
            >
              72
            </span>
            <div className="flex flex-col items-center justify-center shrink-0" style={{ paddingBottom: "2.72px" }}>
              <span
                className="font-medium text-[#1f2937]"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "16.29px",
                  lineHeight: "21.72px",
                  letterSpacing: "-0.08px",
                }}
              >
                bpm
              </span>
            </div>
          </div>
          <span
            className="text-[#4b5563] w-full"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13.58px",
              lineHeight: "19.01px",
              letterSpacing: "-0.05px",
            }}
          >
            Resting Rate
          </span>
        </div>
        <div className="flex flex-1 flex-col" style={{ gap: "4.07px" }}>
          <div className="relative shrink-0" style={{ width: "151.21px", height: "40.73px" }}>
            <div
              className="absolute flex items-center justify-center"
              style={{ inset: "4.89% 0 0 0" }}
            >
              <div style={{ transform: "scaleY(-1)", height: "61.98px", width: "162.92px", flexShrink: 0 }}>
                <div className="relative size-full">
                  <img alt="" className="absolute block max-w-none size-full" src={A.hrChartBg} />
                </div>
              </div>
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{ inset: "4.89% 0 0 0" }}
            >
              <div style={{ transform: "scaleY(-1)", height: "61.98px", width: "162.92px", flexShrink: 0 }}>
                <div className="relative size-full">
                  <div className="absolute" style={{ inset: "-2.63% -0.67% -4.43% -0.67%" }}>
                    <img alt="" className="block max-w-none size-full" src={A.hrChartLine} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex items-start justify-between w-full text-[#1f2937] text-center"
            style={{
              padding: "0 2.04px",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "10.86px",
              lineHeight: "16.29px",
              letterSpacing: "-0.04px",
            }}
          >
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} style={{ width: "9.16px" }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hydration floating card ───────────────────────────────────────────────────
const hydrationBars = [
  { src: A.barFull, height: "40.61px", label: "M" },
  { src: A.bar67, height: "27.41px", label: "T" },
  { src: A.bar52, height: "21.32px", label: "W" },
  { src: A.bar75, height: "30.46px", label: "T" },
  { src: A.bar87, height: "35.53px", label: "F" },
  { src: A.barFull, height: "40.61px", label: "S" },
  { src: A.bar60, height: "24.36px", label: "S" },
];

function HydrationCard() {
  return (
    <div
      className="bg-white flex flex-col items-end overflow-hidden"
      style={{
        width: "350.23px",
        borderRadius: "32.49px",
        padding: "16.24px 18.27px",
        gap: "24.36px",
        boxShadow:
          "0px 5.41px 10.83px 0px rgba(15,23,42,0.03), 0px 10.83px 21.66px 0px rgba(15,23,42,0.02)",
      }}
    >
      <div className="flex items-center w-full" style={{ gap: "16.24px" }}>
        <div className="flex flex-1 items-center" style={{ gap: "6.09px" }}>
          <div className="relative shrink-0" style={{ width: "21.66px", height: "21.66px" }}>
            <div className="absolute" style={{ inset: "8.33% 17.21% 8.33% 17.22%" }}>
              <img alt="" className="absolute block max-w-none size-full" src={A.waterIcon} />
            </div>
          </div>
          <span
            className="font-bold text-[#1f2937] flex-1"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16.24px",
              lineHeight: "21.66px",
              letterSpacing: "-0.08px",
            }}
          >
            Hydration
          </span>
        </div>
        <div className="flex items-center shrink-0" style={{ gap: "4.06px" }}>
          <span
            className="text-[#4b5563]"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16.24px",
              lineHeight: "21.66px",
              letterSpacing: "-0.08px",
            }}
          >
            Today
          </span>
          <div className="relative shrink-0" style={{ width: "21.66px", height: "21.66px" }}>
            <div className="absolute" style={{ inset: "12.5% 31.9% 12.5% 33.33%" }}>
              <img alt="" className="absolute block max-w-none size-full" src={A.hydChevron} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full" style={{ gap: "12.18px" }}>
        <div className="flex flex-1 flex-col" style={{ gap: "4.06px" }}>
          <div className="flex items-end" style={{ gap: "2.03px" }}>
            <span
              className="font-bold text-[#1f2937] shrink-0"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "24.36px",
                lineHeight: "32.48px",
                letterSpacing: "-0.19px",
              }}
            >
              2,125
            </span>
            <div className="flex flex-col items-center justify-center shrink-0" style={{ paddingBottom: "2.71px" }}>
              <span
                className="font-medium text-[#1f2937]"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "16.24px",
                  lineHeight: "21.66px",
                  letterSpacing: "-0.08px",
                }}
              >
                ml
              </span>
            </div>
          </div>
          <span
            className="text-[#4b5563] w-full"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13.54px",
              lineHeight: "18.95px",
              letterSpacing: "-0.05px",
            }}
          >
            On Track
          </span>
        </div>
        <div className="flex flex-1 items-center justify-between">
          {hydrationBars.map((bar, i) => (
            <div
              key={i}
              className="flex flex-col items-center shrink-0"
              style={{ gap: "4.06px", width: "9.14px" }}
            >
              <div
                className="flex items-end shrink-0"
                style={{ width: "8.12px", height: "40.61px" }}
              >
                <div className="relative shrink-0" style={{ width: "8.12px", height: bar.height }}>
                  <img alt="" className="absolute block max-w-none size-full" src={bar.src} />
                </div>
              </div>
              <span
                className="text-[#1f2937] text-center"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "10.83px",
                  lineHeight: "16.24px",
                  letterSpacing: "-0.04px",
                  minWidth: "100%",
                }}
              >
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Blood Pressure floating card ──────────────────────────────────────────────
const bpDays = [
  { label: "M", checked: true },
  { label: "T", checked: false },
  { label: "W", checked: false },
  { label: "T", checked: true },
  { label: "F", checked: false },
  { label: "S", checked: false },
  { label: "S", checked: true },
];

function BloodPressureCard() {
  return (
    <div
      className="bg-white flex flex-col items-end overflow-hidden"
      style={{
        width: "352.65px",
        borderRadius: "32.71px",
        padding: "16.36px 18.4px",
        gap: "24.53px",
        boxShadow:
          "0px 5.45px 10.9px 0px rgba(15,23,42,0.03), 0px 10.9px 21.81px 0px rgba(15,23,42,0.02)",
      }}
    >
      <div className="flex items-center w-full" style={{ gap: "16.36px" }}>
        <div className="flex flex-1 items-center" style={{ gap: "6.13px" }}>
          <div className="relative shrink-0" style={{ width: "21.81px", height: "21.81px" }}>
            <div className="absolute" style={{ inset: "8.33% 8.33% 4.17% 8.33%" }}>
              <img alt="" className="absolute block max-w-none size-full" src={A.bpIcon} />
            </div>
          </div>
          <span
            className="font-bold text-[#1f2937] flex-1"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16.36px",
              lineHeight: "21.81px",
              letterSpacing: "-0.08px",
            }}
          >
            Blood Pressure
          </span>
        </div>
        <div className="flex items-center shrink-0" style={{ gap: "4.09px" }}>
          <span
            className="text-[#4b5563]"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16.36px",
              lineHeight: "21.81px",
              letterSpacing: "-0.08px",
            }}
          >
            Today
          </span>
          <div className="relative shrink-0" style={{ width: "21.81px", height: "21.81px" }}>
            <div className="absolute" style={{ inset: "12.5% 31.9% 12.5% 33.33%" }}>
              <img alt="" className="absolute block max-w-none size-full" src={A.bpChevron} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full" style={{ gap: "12.27px" }}>
        <div className="flex flex-1 flex-col" style={{ gap: "4.09px" }}>
          <div className="flex items-end" style={{ gap: "2.04px" }}>
            <span
              className="font-bold text-[#1f2937] shrink-0"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "24.53px",
                lineHeight: "32.71px",
                letterSpacing: "-0.2px",
              }}
            >
              120/60
            </span>
            <div className="flex flex-col items-center justify-center shrink-0" style={{ paddingBottom: "2.73px" }}>
              <span
                className="font-medium text-[#1f2937]"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "16.36px",
                  lineHeight: "21.81px",
                  letterSpacing: "-0.08px",
                }}
              >
                mmHg
              </span>
            </div>
          </div>
          <span
            className="text-[#4b5563] w-full"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "13.63px",
              lineHeight: "19.08px",
              letterSpacing: "-0.05px",
            }}
          >
            Within Normal Range
          </span>
        </div>
        <div className="flex flex-1 items-center justify-between overflow-hidden">
          {bpDays.map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center shrink-0"
              style={{ gap: "4.09px" }}
            >
              {day.checked ? (
                <div
                  className="bg-[#8b5cf6] rounded-full overflow-hidden relative shrink-0 flex items-center justify-center"
                  style={{ width: "16.36px", height: "16.36px" }}
                >
                  <div className="relative overflow-hidden" style={{ width: "10.22px", height: "10.22px" }}>
                    <img alt="" className="absolute block max-w-none size-full" src={A.checkBg} />
                    <div className="absolute" style={{ inset: "28.13% 12.5% 21.88% 15.63%" }}>
                      <div className="absolute" style={{ inset: "-16.7% -11.62%" }}>
                        <img alt="" className="block max-w-none size-full" src={A.checkMark} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-white border border-[#d1d5db] rounded-full shrink-0"
                  style={{ width: "16.36px", height: "16.36px", borderWidth: "1.022px" }}
                />
              )}
              <span
                className="text-[#1f2937] text-center"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "10.9px",
                  lineHeight: "16.36px",
                  letterSpacing: "-0.04px",
                  minWidth: "100%",
                }}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tension Headache floating card ────────────────────────────────────────────
function TensionHeadacheCard() {
  return (
    <div
      className="bg-white flex flex-col items-start overflow-hidden"
      style={{
        width: "336.84px",
        borderRadius: "31.43px",
        padding: "15.71px",
        boxShadow:
          "0px 3.93px 7.86px 0px rgba(15,23,42,0.03), 0px 7.86px 15.71px 0px rgba(15,23,42,0.02)",
      }}
    >
      <div className="flex items-start w-full" style={{ gap: "11.78px" }}>
        <div
          className="bg-[#fff1f2] rounded-full flex items-center justify-center shrink-0"
          style={{ width: "47.14px", height: "47.14px" }}
        >
          <div className="relative shrink-0" style={{ width: "23.57px", height: "23.57px" }}>
            <div className="absolute" style={{ inset: "8.33% 8.33% 8.33% 12.5%" }}>
              <img alt="" className="absolute block max-w-none size-full" src={A.thIcon} />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col" style={{ gap: "7.86px" }}>
          <div className="flex flex-col w-full" style={{ gap: "11.78px" }}>
            <div className="flex items-center w-full" style={{ gap: "6.87px" }}>
              <span
                className="font-bold text-[#1f2937] flex-1"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "15.71px",
                  lineHeight: "21.61px",
                  letterSpacing: "-0.11px",
                }}
              >
                Tension Headache
              </span>
              <div className="relative shrink-0" style={{ width: "19.64px", height: "19.64px" }}>
                <div className="absolute" style={{ inset: "12.5% 31.9% 12.5% 33.33%" }}>
                  <img alt="" className="absolute block max-w-none size-full" src={A.thChevron} />
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "7.86px", borderRadius: "1234px" }}
            >
              <div
                className="absolute inset-0 bg-[#e5e7eb]"
                style={{ borderRadius: "1234px" }}
              />
              <div
                className="absolute inset-0 bg-[#f43f5e]"
                style={{
                  right: "8.13%",
                  borderRadius: "1234px",
                  transform: "scaleY(-1)",
                }}
              />
            </div>
            <div className="flex items-center w-full" style={{ gap: "7.86px" }}>
              <div className="flex flex-1 items-center" style={{ gap: "3.93px" }}>
                <div className="relative shrink-0" style={{ width: "21.61px", height: "21.61px" }}>
                  <div className="absolute" style={{ inset: "4.81% 7.37% 3.76% 7.93%" }}>
                    <img alt="" className="absolute block max-w-none size-full" src={A.sparkle} />
                  </div>
                </div>
                <span
                  className="font-semibold text-[#1f2937] shrink-0"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "13.75px",
                    lineHeight: "19.64px",
                    letterSpacing: "-0.08px",
                  }}
                >
                  80% Match
                </span>
              </div>
              <div className="flex items-center shrink-0" style={{ gap: "3.93px" }}>
                <div className="relative shrink-0" style={{ width: "9.82px", height: "9.82px" }}>
                  <div
                    className="absolute bg-[#f43f5e] rounded-full"
                    style={{ inset: "10%" }}
                  />
                </div>
                <span
                  className="font-medium text-[#1f2937]"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "13.75px",
                    lineHeight: "19.64px",
                    letterSpacing: "-0.08px",
                  }}
                >
                  High Risk
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: "7.86px" }}>
            <span
              className="text-[#4b5563] shrink-0"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13.75px",
                lineHeight: "19.64px",
                letterSpacing: "-0.08px",
              }}
            >
              2 suggestion
            </span>
            <div className="relative shrink-0" style={{ width: "5.89px", height: "5.89px" }}>
              <div
                className="absolute bg-[#d1d5db] rounded-full"
                style={{ inset: "16.67%" }}
              />
            </div>
            <span
              className="text-[#4b5563] shrink-0"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13.75px",
                lineHeight: "19.64px",
                letterSpacing: "-0.08px",
              }}
            >
              Treatable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WelcomePage ───────────────────────────────────────────────────────────────
export function WelcomePage() {
  const navigate = useNavigate();
  const { quickLogin } = useAuthStore();
  const [email, setEmail] = useState("");
  const { loading: emailLoading, withDelay: withEmailDelay } = useMockDelay(300, 500);
  const { loading: googleLoading, withDelay: withGoogleDelay } = useMockDelay(600, 900);

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    withEmailDelay(() => navigate(ROUTES.REGISTER_EMAIL));
  };

  const handleGoogleSignIn = () => {
    withGoogleDelay(() => {
      quickLogin("patient");
      navigate(ROUTES.REGISTER_PROFILE);
    });
  };

  return (
    <div
      className="bg-[#f7f7f8] relative overflow-x-hidden"
      style={{ minWidth: "1440px", minHeight: "1024px" }}
    >
      {/* ── Bottom badges ── */}
      <div
        className="absolute flex items-center"
        style={{
          left: "calc(50% - 360.38px)",
          top: "938px",
          transform: "translateX(-50%)",
          gap: "24px",
          height: "16px",
        }}
      >
        <div className="flex items-center" style={{ gap: "3.99px" }}>
          <div className="shrink-0" style={{ width: "9.33px", height: "11.67px" }}>
            <img alt="" className="size-full" src={A.secureIcon} />
          </div>
          <span
            className="text-[#0f172a] font-normal"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "16px" }}
          >
            Secure &amp; Private
          </span>
        </div>
        <div className="flex items-center" style={{ gap: "3.99px" }}>
          <div className="shrink-0" style={{ width: "9.33px", height: "11.67px" }}>
            <img alt="" className="size-full" src={A.aiIcon} />
          </div>
          <span
            className="text-[#0f172a] font-normal"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "16px" }}
          >
            AI Powered
          </span>
        </div>
      </div>

      {/* ── Form content ── */}
      <div
        className="absolute flex flex-col items-center"
        style={{ left: "192px", top: "330px", width: "360px", gap: "32px" }}
      >
        {/* Heading */}
        <div className="flex flex-col items-center w-full" style={{ gap: "12px" }}>
          <p
            className="font-semibold text-[#181d27] w-full text-center"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
          >
            Create an account
          </p>
          <p
            className="font-normal text-[#535862] w-full text-center"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
          >
            Start your 30-day free trial.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col items-center w-full" style={{ gap: "24px" }}>
          <div className="flex flex-col w-full" style={{ gap: "16px" }}>
            {/* Email input */}
            <form onSubmit={handleGetStarted} className="flex flex-col w-full" style={{ gap: "16px" }}>
              <div
                className="bg-white border border-[#d5d7da] flex items-center w-full"
                style={{
                  borderRadius: "8px",
                  padding: "10px 14px",
                  gap: "8px",
                  boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-[#717680] font-normal"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "24px",
                    minWidth: 0,
                  }}
                />
              </div>

              {/* Get started button */}
              <button
                type="submit"
                disabled={emailLoading}
                className="relative w-full flex items-center justify-center overflow-hidden cursor-pointer"
                style={{
                  borderRadius: "8px",
                  padding: "10px 16px",
                  gap: "6px",
                  border: "2px solid rgba(255,255,255,0.12)",
                  boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                }}
              >
                <span
                  className="absolute inset-0 bg-[#047857]"
                  style={{ borderRadius: "8px" }}
                />
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: "inherit",
                    boxShadow:
                      "inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)",
                  }}
                />
                <div className="relative flex items-center justify-center px-[2px]">
                  <span
                    className="font-semibold text-white whitespace-nowrap"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
                  >
                    {emailLoading ? "Loading…" : "Get started"}
                  </span>
                </div>
              </button>
            </form>
          </div>

          {/* OR divider */}
          <div className="flex items-center w-full" style={{ gap: "8px" }}>
            <div className="flex-1 h-px bg-[#e9eaeb]" />
            <span
              className="font-medium text-[#535862] shrink-0 text-center whitespace-nowrap"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
            >
              OR
            </span>
            <div className="flex-1 h-px bg-[#e9eaeb]" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col items-center justify-center w-full" style={{ gap: "12px" }}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="relative w-full flex items-center justify-center overflow-hidden border border-[#d5d7da] cursor-pointer"
              style={{
                borderRadius: "8px",
                padding: "10px 16px",
                gap: "12px",
                boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
              }}
            >
              <span
                className="absolute inset-0 bg-white"
                style={{ borderRadius: "8px" }}
              />
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: "inherit",
                  boxShadow:
                    "inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)",
                }}
              />
              {/* Google icon */}
              <div className="relative overflow-hidden shrink-0" style={{ width: "24px", height: "24px" }}>
                <div className="absolute" style={{ inset: "40.99% 0.97% 12.07% 51%" }}>
                  <img alt="" className="absolute block max-w-none size-full" src={A.googleBlue} />
                </div>
                <div className="absolute" style={{ inset: "59.58% 15.86% 0 6.32%" }}>
                  <img alt="" className="absolute block max-w-none size-full" src={A.googleGreen} />
                </div>
                <div className="absolute" style={{ inset: "27.56% 77.07% 27.54% 1%" }}>
                  <img alt="" className="absolute block max-w-none size-full" src={A.googleRed} />
                </div>
                <div className="absolute" style={{ inset: "0 15.54% 59.56% 6.32%" }}>
                  <img alt="" className="absolute block max-w-none size-full" src={A.googleYellow} />
                </div>
              </div>
              <span
                className="relative font-semibold text-[#414651] whitespace-nowrap"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
              >
                {googleLoading ? "Connecting…" : "Sign up with Google"}
              </span>
            </button>
          </div>
        </div>

        {/* Already have account */}
        <div className="flex items-start justify-center w-full" style={{ gap: "4px" }}>
          <span
            className="font-normal text-[#535862] whitespace-nowrap"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
          >
            Already have an account?
          </span>
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
            className="flex items-center justify-center overflow-hidden cursor-pointer"
            style={{ gap: "4px" }}
          >
            <span
              className="font-semibold text-[#047857] whitespace-nowrap"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
            >
              Log in
            </span>
          </button>
        </div>
      </div>

      {/* ── Hero image ── */}
      <div
        className="absolute rounded-[20px] overflow-hidden"
        style={{ left: "720px", top: "16px", width: "704px", height: "992px" }}
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full"
          src={A.heroBg}
        />
      </div>

      {/* ── Logo badge ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: "348px",
          top: "calc(50% - 214px)",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          boxShadow:
            "0px 142.57px 25.53px 0px rgba(7,49,27,0), 0px 91.2px 25.53px 0px rgba(7,49,27,0.01), 0px 51.37px 25.53px 0px rgba(7,49,27,0.05), 0px 22.77px 22.77px 0px rgba(7,49,27,0.08), 0px 5.72px 12.56px 0px rgba(7,49,27,0.09)",
        }}
      >
        <img
          alt=""
          className="absolute max-w-none"
          src={A.logoBadge}
          style={{
            height: "122.16%",
            left: "-57.95%",
            top: "-6.29%",
            width: "218.03%",
          }}
        />
      </div>

      {/* ── Heart Rate card ── */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: "595px", top: "55px", width: "366.632px", height: "186.267px" }}
      >
        <div style={{ transform: "rotate(-7.34deg)", flexShrink: 0 }}>
          <HeartRateCard />
        </div>
      </div>

      {/* ── Hydration card ── */}
      <div
        className="absolute flex items-center justify-center"
        style={{ bottom: "151.04px", right: "-11.27px", width: "363.274px", height: "178.956px" }}
      >
        <div style={{ transform: "rotate(-6deg)", flexShrink: 0 }}>
          <HydrationCard />
        </div>
      </div>

      {/* ── Blood Pressure card ── */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "calc(50% + 104px)",
          top: "calc(50% + 77.11px)",
          transform: "translate(-50%, -50%)",
          width: "362.425px",
          height: "164.59px",
        }}
      >
        <div style={{ transform: "rotate(4.56deg)", flexShrink: 0 }}>
          <BloodPressureCard />
        </div>
      </div>

      {/* ── Tension Headache card ── */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "calc(50% + 567px)",
          top: "455px",
          transform: "translateX(-50%)",
          width: "362.425px",
        }}
      >
        <div style={{ transform: "rotate(9.22deg)", flexShrink: 0 }}>
          <TensionHeadacheCard />
        </div>
      </div>
    </div>
  );
}
