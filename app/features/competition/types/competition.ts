export type Status = "not_started" | "running" | "finished";
export type Phase = "qualification" | "final";
export type Shot = "positive" | "negative";

export type CompetitionState = {
  id: string;
  status: Status;
  phase: Phase;
  category: {
    id: string;
    name: string;
  };
  groups: QualificationGroupState[];
};

export type QualificationGroupState = {
  id: string;
  name: string;
  status: Status;
  currentRound: QualificationRoundState | null;
};

export type QualificationRoundState = {
  id: string;
  number: number;
  status: Status;
  registrations: CompetitionRoundRegistrationState[];
  results: QualificationResultState[];
};

export type CompetitionRoundRegistrationState = {
  id: string;
  number: number;
  name: string | null;
  competitors: QualificationCompetitorState[];
};

export type QualificationCompetitorState = {
  id: string;
  name: string;
};

export type QualificationResultState = {
  id: string;
  registrationId: string;
  competitorId: string;
  shot: Shot | null;
};
