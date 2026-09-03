import type { Phase, Shot, Status } from "../competition/types/competition";
export interface DisplayCompetitor {
  id: string;
  name: string;
  positiveShots: number;
  totalShots: number;
  currentShot: Shot | null;
  recentResults: { id: string; roundNumber: number; shot: Shot }[];
}
export interface DisplayRegistration {
  id: string;
  number: number;
  name: string | null;
  status: "active" | "eliminated";
  bonus: number | null;
  positiveShots: number;
  totalShots: number;
  competitors: DisplayCompetitor[];
}
export interface DisplayGroup {
  activeRegistrationCount: number;
  id: string;
  name: string;
  phase: Phase;
  status: Status;
  order: number;
  roundId: string | null;
  roundNumber: number | null;
  roundStatus: Status | null;
  registrations: DisplayRegistration[];
}
export interface OnTrack extends DisplayCompetitor {
  registrationId: string;
  registrationNumber: number;
  bonus: number | null;
  registrationPositiveShots: number;
  registrationTotalShots: number;
}
export interface Scoreboard {
  lastResult: {
    id: string;
    name: string;
    registrationNumber: number;
    shot: Shot;
    roundNumber: number;
  } | null;
  competition: {
    id: string;
    phase: Phase;
    status: Status;
    category: {
      name: string;
      categoryType: string;
      finalBonusEnabled: boolean;
    };
  };
  group: DisplayGroup | null;
  current: OnTrack | null;
  next: OnTrack[];
  standings: DisplayGroup[];
  generatedAt: string;
}
