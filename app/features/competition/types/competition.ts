type Phase = "qualification" | "final";
type Status = "not_started" | "running" | "finished";
type Shot = "positive" | "negative";

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
  rounds: QualificationRoundState[];
  registrations: QualificationRegistrationState[];
};

export type QualificationRegistrationState = {
  id: string;
  number: number;
  name: string | null;
  score: number;
  eliminated: boolean;
  competitors: QualificationCompetitorState[];
};

export type QualificationCompetitorState = {
  id: string;
  name: string;
};

export type QualificationRoundState = {
  id: string;
  number: number;
  status: Status;
  registrations: QualificationRegistrationState[];
  results: QualificationResultState[];
};

export type QualificationResultState = {
  id: string;
  registrationId: string;
  competitors: {
    id: string;
    name: string;
    shot: Shot;
  }[];
};
