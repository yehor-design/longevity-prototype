import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface QuestionnaireProgressState {
  progressPercentage: number;
  lastSavedDate: Date | string | null;
  statusLabel: string;
  userAvatarUrl?: string;
  setProgress: (percentage: number) => void;
  setLastSavedDate: (date: Date | string) => void;
  setStatusLabel: (label: string) => void;
}

export const useQuestionnaireProgressStore = create<QuestionnaireProgressState>()(
  devtools(
    persist(
      (set) => ({
        // Mock seed data — 42% through onboarding questionnaire
        progressPercentage: 42,
        lastSavedDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        statusLabel: "In Progress",
        userAvatarUrl: undefined,

        setProgress: (percentage) =>
          set({ progressPercentage: Math.min(100, Math.max(0, percentage)) }),
        setLastSavedDate: (date) => set({ lastSavedDate: date }),
        setStatusLabel: (label) => set({ statusLabel: label }),
      }),
      { name: "questionnaire-progress" }
    ),
    { name: "questionnaire-progress" }
  )
);
