import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PatientUser } from "@/types";

interface UserState {
  profile: PatientUser | null;
  isLoading: boolean;
  setProfile: (profile: PatientUser) => void;
  updateProfile: (patch: Partial<PatientUser>) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      profile: null,
      isLoading: false,

      setProfile: (profile) => set({ profile }, false, "user/setProfile"),
      updateProfile: (patch) =>
        set(
          (s) =>
            s.profile ? { profile: { ...s.profile, ...patch } } : {},
          false,
          "user/updateProfile"
        ),
      setLoading: (isLoading) => set({ isLoading }, false, "user/setLoading"),
    }),
    { name: "UserStore" }
  )
);
