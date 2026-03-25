import { useEffect, useRef, useState } from "react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import userFocusSvg from "@/assets/auth/user-focus.svg";
import userIconSvg from "@/assets/auth/user-icon.svg";
import calendarIconSvg from "@/assets/auth/calendar-icon.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
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
      className="absolute left-0 top-[calc(100%+6px)] z-50 w-full min-w-[280px] rounded-xl border border-border bg-white p-4 shadow-[0px_8px_24px_0px_rgba(10,13,18,0.12),0px_1px_3px_0px_rgba(10,13,18,0.08)]"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8.75 2.5L4.75 7L8.75 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>

        <span className="text-sm font-semibold text-[#0a0a0a]">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5.25 2.5L9.25 7L5.25 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-xs font-medium text-[#717680]"
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
              className="flex h-8 w-full items-center justify-center rounded-md text-[13px] transition-colors"
              style={{
                fontWeight: selected ? 600 : 400,
                backgroundColor: selected ? "var(--primary)" : "transparent",
                color: selected ? "rgba(255,255,255,0.88)" : todayCell ? "var(--primary)" : "#0a0a0a",
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
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="absolute left-4 top-4 z-30 h-8 gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#18181b]"
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        Back
      </Button>

      {/* Left content panel */}
      <div className="relative z-10 flex h-full items-center justify-center lg:w-[calc(50vw-16px)]">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-10 px-4">

          {/* Header block */}
          <div className="flex w-full max-w-[350px] flex-col items-center gap-6">
            {/* User Focus icon */}
            <div
              className="flex size-16 shrink-0 items-start rounded-2xl p-4"
              style={{ backgroundColor: "rgba(158,119,237,0.12)" }}
            >
              <img alt="" src={userFocusSvg} aria-hidden="true" className="size-8" />
            </div>

            {/* Title + subtitle */}
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <p className="text-[18px] font-medium leading-[26px] text-[#0a0a0a]">
                Complete your profile
              </p>
              <div className="text-sm leading-5 text-[#6f6f77]">
                <p>Tell us a bit about yourself.</p>
                <p>You can always update this later.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex w-full flex-col gap-4">

            {/* First name */}
            <div className="flex w-full flex-col gap-1.5">
              <Label htmlFor="first-name" className="text-sm font-medium text-[#414651]">
                First name
              </Label>
              <div className="relative">
                <img alt="" src={userIconSvg} aria-hidden="true" className="absolute left-3 top-1/2 size-5 -translate-y-1/2 shrink-0" />
                <Input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="h-11 border-[#d5d7da] bg-white pl-10 text-base shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680]"
                />
              </div>
            </div>

            {/* Last name */}
            <div className="flex w-full flex-col gap-1.5">
              <Label htmlFor="last-name" className="text-sm font-medium text-[#414651]">
                Last name
              </Label>
              <div className="relative">
                <img alt="" src={userIconSvg} aria-hidden="true" className="absolute left-3 top-1/2 size-5 -translate-y-1/2 shrink-0" />
                <Input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-11 border-[#d5d7da] bg-white pl-10 text-base shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680]"
                />
              </div>
            </div>

            {/* Date of birth */}
            <div className="relative flex w-full flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#414651]">
                Date of birth
              </Label>
              <Button
                ref={dateButtonRef}
                type="button"
                variant="outline"
                onClick={() => setDatePickerOpen((v) => !v)}
                className="h-11 w-full justify-start gap-2 border-[#d5d7da] bg-white px-3 text-base font-normal shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
              >
                <img alt="" src={calendarIconSvg} aria-hidden="true" className="size-5 shrink-0" />
                <span className={birthDate ? "text-foreground" : "text-[#717680]"}>
                  {birthDate ? formatDate(birthDate) : "Select date"}
                </span>
              </Button>

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
            <div className="flex w-full flex-col gap-2">
              <Button
                type="button"
                onClick={onContinue}
                className="h-10 w-full rounded-lg text-sm font-medium"
              >
                Continue
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onSkip}
                className="h-10 w-full rounded-lg text-sm font-medium"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
