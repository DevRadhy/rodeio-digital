import type { Competition, CompetitionGroup } from "@/types/competition";
import { create } from "zustand";

interface CompetitionSessionState {
  sessions: Record<string, Competition>;
  currentSessionId: string | null;
  openSession: (categoryId: string, groups: CompetitionGroup[]) => void;
  updateSession: (categoryId: string, groups: CompetitionGroup) => void;
  getSession: (categoryId: string) => Competition;
}

export const useCompetitionSessionStore = create<CompetitionSessionState>()(
  (set, get) => ({
    sessions: {},
    currentSessionId: null,
    openSession: (categoryId, groups) =>
      set((state) => {
        if (state.sessions[categoryId]) {
          return {
            currentSessionId: categoryId,
          };
        }

        return {
          currentSessionId: categoryId,
          sessions: {
            ...state.sessions,
            [categoryId]: {
              categoryId,
              status: "running",
              phase: "qualification",
              groups: groups,
            },
          },
        };
      }),
    updateSession: (categoryId, group) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          [categoryId]: {
            ...state.sessions[categoryId],
            groups: state.sessions[categoryId].groups.map((g) => {
              if (g.id !== group.id) {
                return g;
              }

              return group;
            }),
          },
        },
      })),
    getSession: (categoryId: string) => get().sessions[categoryId],
  }),
);
