import type { Competition } from "@/types/competition";
import { create } from "zustand";

interface CompetitionsState {
  competitions: Competition[]
}

const useCompetition = create<CompetitionsState>()((set) => ({
  competitions: []
}))