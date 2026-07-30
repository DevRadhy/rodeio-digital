import type { Competition, CompetitionSession } from "@/types/competition";
import { create } from "zustand";

interface CompetitionSessionState {
  sessions: Record<string, CompetitionSession>;
  currentSessionId: string | null;
  openSession: (categoryId: string, run: Competition) => void;
  switchSession: (categoriId: string) => void;
  updateRun: (categoryId: string, run: Competition) => void;
  pauseSession: (categoryId: string) => void;
  resumeSession: (categoryId: string) => void;
  finishSession: (categoryId: string) => void;
  setActiveGroup: (categoryId: string, groupId: string) => void;
  getSession: (categoryId: string) => CompetitionSession;
}

export const useCompetitionSession = create<CompetitionSessionState>()((set, get) => ({
  sessions: {},
  currentSessionId: null,
  openSession: (categoryId, run) =>
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
            run,
            activeGroupId: null,
          },
        },
      };
    }),
  switchSession: (categoryId) => set({ currentSessionId: categoryId }),
  updateRun: (categoryId, run) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [categoryId]: {
          ...state.sessions[categoryId],
          run,
        },
      },
    })),
  pauseSession: (categoryId) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [categoryId]: {
          ...state.sessions[categoryId],
          run: {
            ...state.sessions[categoryId].run,
            status: "paused",
          },
        },
      },
    })),
  resumeSession: (categoryId) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [categoryId]: {
          ...state.sessions[categoryId],
          run: {
            ...state.sessions[categoryId].run,
            status: "running",
          },
        },
      },
    })),
  finishSession: (categoryId) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [categoryId]: {
          ...state.sessions[categoryId],
          run: {
            ...state.sessions[categoryId].run,
            status: "finished",
          },
        },
      },
    })),
  setActiveGroup: (categoryId, groupId) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [categoryId]: {
          ...state.sessions[categoryId],
          activeGroupId: groupId,
        },
      },
    })),
  getSession: (categoryId: string) => get().sessions[categoryId],
}));
