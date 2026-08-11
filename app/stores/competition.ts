import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Competition } from "@/types/competition";

interface CompetitionSessionState {
  sessions: Record<string, Competition>;
  currentSessionId: string | null;
  createCompetition: (competition: Competition) => void;
  updateCompetition: (competition: Competition) => void;
  getSession: (categoryId: string) => Competition;
}

export const useCompetitionSessionStore = create<CompetitionSessionState>()(
  devtools((set, get) => ({
    sessions: {},
    currentSessionId: null,
    createCompetition: (competition) =>
      set((state) => {
        if (state.sessions[competition.categoryId]) {
          return {
            currentSessionId: competition.categoryId,
          };
        }

        return {
          currentSessionId: competition.categoryId,
          sessions: {
            ...state.sessions,
            [competition.categoryId]: competition,
          },
        };
      }),
    updateCompetition: (competition) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          [competition.categoryId]: competition,
        },
      })),
    getSession: (categoryId: string) => get().sessions[categoryId],
  })),
);
