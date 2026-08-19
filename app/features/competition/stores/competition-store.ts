import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { applyShotRegisteredEvent } from "../events";
import type { CompetitionState } from "../types/competition";
import type { CompetitionShotRegisteredEvent } from "../types/competition-event";

interface CompetitionStateStore {
  competition: CompetitionState | null;
  setCompetition(competition: CompetitionState): void;
  applyShotRegistered(event: CompetitionShotRegisteredEvent["payload"]): void;
}

export const useCompetitionStore = create<CompetitionStateStore>()(
  devtools((set) => ({
    competition: null,
    setCompetition: (competition) => set({ competition }),
    applyShotRegistered: (event) =>
      set((state) => {
        if (!state.competition) {
          return state;
        }

        return {
          competition: applyShotRegisteredEvent(state.competition, event),
        };
      }),
  })),
);
