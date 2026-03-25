import { useEffect, useRef, useState } from "react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import userFocusSvg from "@/assets/auth/user-focus.svg";
import userIconSvg from "@/assets/auth/user-icon.svg";
import calendarIconSvg from "@/assets/auth/calendar-icon.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

function DatePicker({ value, onChange, onClose, anchorRef }: DatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value ? value.getFullYear() : today.getFullYear() - 25);
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : today.getMonth());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        pickerRef.current && !pickerRef.current.contains(target) &&
        anchorRef.current && !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (day: number) =>
    value !== null &&
    value.getFullYear() === viewYear &&
    value.getMonth() === viewMonth &&
    value.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  return (
    <div
      ref={pickerRef}
      className="absolute left-0 top-[calc(100%+6px)] z-50 w-full min-w-[280px] rounded-[12px] bg-white p-4"
      style={{
        border: "1px solid #e4e4e7",
        boxShadow: "0px 8px 24px 0px rgba(10,13,18,0.12), 0px 1px 3px 0px rgba(10,13,18,0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex size-7 items-center justify-center rounded-[6px] text-[#414651] hover:bg-[#f4f4f5] transition-colors"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8.75 2.5L4.75 7L8.75 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#0a0a0a",
          }}
        >
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          className="flex size-7 items-center justify-center rounded-[6px] text-[#414651] hover:bg-[#f4f4f5] transition-colors"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5.25 2.5L9.25 7L5.25 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#717680",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-8" />;
          const selected = isSelected(day);
          const todayCell = isToday(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                onChange(new Date(viewYear, viewMonth, day));
                onClose();
              }}
              className="flex h-8 w-full items-center justify-center rounded-[6px] transition-colors"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: selected ? 600 : 400,
                fontSize: "13px",
                lineHeight: "20px",
                backgroundColor: selected ? "#047857" : "transparent",
                color: selected ? "rgba(255,255,255,0.88)" : todayCell ? "#047857" : "#0a0a0a",
              }}
              onMouseEnter={(e) => {
                if (!selected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f4f4f5";
              }}
              onMouseLeave={(e) => {
                if (!selected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ProfileSetupScreenProps {
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function ProfileSetupScreen({ onBack, onContinue, onSkip }: ProfileSetupScreenProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <AuthHeroPanel />
      <AuthBottomBadges />

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-30 inline-flex items-center justify-center gap-[6px] rounded-[6px] px-[10px] py-[6px] text-[#18181b] hover:opacity-80 transition-opacity"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "20px", fontWeight: 500 }}
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        <span>Back</span>
      </button>

      {/* Left content panel */}
      <div className="relative z-10 flex h-full items-center justify-center lg:w-[calc(50vw-16px)]">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-[40px] px-4">

          {/* Header block */}
          <div className="flex w-full max-w-[350px] flex-col items-center gap-[24px]">
            {/* User Focus icon */}
            <div
              className="flex shrink-0 items-start rounded-[16px] p-[16px]"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "rgba(158,119,237,0.12)",
              }}
            >
              <img alt="" src={userFocusSvg} aria-hidden="true" className="size-[32px]" />
            </div>

            {/* Title + subtitle */}
            <div
              className="flex w-full flex-col items-center gap-[8px] text-center"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontStyle: "normal" }}
            >
              <p style={{ fontSize: "18px", lineHeight: "26px", color: "#0a0a0a" }}>
                Complete your profile
              </p>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "#6f6f77" }}>
                <p>Tell us a bit about yourself.</p>
                <p>You can always update this later.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex w-full flex-col items-center gap-[16px]">

            {/* First name */}
            <div className="flex w-full flex-col gap-[6px]">
              <label
                htmlFor="first-name"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#414651",
                }}
              >
                First name
              </label>
              <div
                className="flex items-center gap-[8px] bg-white px-[14px] py-[10px] rounded-[8px]"
                style={{
                  border: "1px solid #d5d7da",
                  boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                }}
              >
                <img alt="" src={userIconSvg} aria-hidden="true" className="size-[20px] shrink-0" />
                <input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="flex-1 min-w-0 bg-transparent outline-none"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#0a0a0a",
                  }}
                />
              </div>
            </div>

            {/* Last name */}
            <div className="flex w-full flex-col gap-[6px]">
              <label
                htmlFor="last-name"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#414651",
                }}
              >
                Last name
              </label>
              <div
                className="flex items-center gap-[8px] bg-white px-[14px] py-[10px] rounded-[8px]"
                style={{
                  border: "1px solid #d5d7da",
                  boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                }}
              >
                <img alt="" src={userIconSvg} aria-hidden="true" className="size-[20px] shrink-0" />
                <input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="flex-1 min-w-0 bg-transparent outline-none"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#0a0a0a",
                  }}
                />
              </div>
            </div>

            {/* Date of birth */}
            <div className="relative flex w-full flex-col gap-[6px]">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#414651",
                }}
              >
                Date of birth
              </span>

              {/* Date picker trigger button */}
              <button
                ref={dateButtonRef}
                type="button"
                onClick={() => setDatePickerOpen((v) => !v)}
                className="relative flex w-full items-center gap-[4px] overflow-hidden bg-white px-[14px] py-[10px] rounded-[8px] text-left"
                style={{
                  border: "1px solid #d5d7da",
                  boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                }}
              >
                {/* Inner inset ring overlay (matches Figma inner shadow) */}
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />

                <div className="relative shrink-0 size-[20px] overflow-hidden">
                  <div className="absolute inset-[8.33%_12.5%]">
                    <div className="absolute inset-[-5%_-5.56%]">
                      <img alt="" src={calendarIconSvg} className="block size-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center px-[2px]">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: birthDate ? "#0a0a0a" : "#717680",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {birthDate ? formatDate(birthDate) : "Select date"}
                  </span>
                </div>
              </button>

              {/* Date picker popover */}
              {datePickerOpen && (
                <DatePicker
                  value={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  onClose={() => setDatePickerOpen(false)}
                  anchorRef={dateButtonRef}
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-[8px]">
              {/* Continue */}
              <button
                type="button"
                onClick={onContinue}
                className="relative flex w-full items-center justify-center overflow-hidden rounded-[6px] px-[16px] py-[10px] hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "#047857",
                  boxShadow: "0px 1px 2px 0px rgba(4,120,87,0.4), 0px 0px 0px 1px #065f46",
                }}
              >
                <span
                  className="relative whitespace-nowrap"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.88)",
                  }}
                >
                  Continue
                </span>
                {/* Inner top highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0.75px_0px_0px_rgba(255,255,255,0.2)]" />
              </button>

              {/* Skip for now */}
              <button
                type="button"
                onClick={onSkip}
                className="flex w-full items-center justify-center rounded-[6px] px-[16px] py-[10px] hover:opacity-70 transition-opacity"
              >
                <span
                  className="whitespace-nowrap"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#18181b",
                  }}
                >
                  Skip for now
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
