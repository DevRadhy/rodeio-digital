type Phase = "qualification" | "final";
type Status = "not_stated" | "running" | "finished";

export type CompetitionState = {
  id: string;
  status: Status;
  phase: Phase;

  category: {
    id: string;
    name: string;
  };

  qualification: {
    groups: QualificationGroupState[];
  };
};

export type QualificationGroupState = {
  id: string;
  name: string;
  status: Status;
  currentRound: number | null;

  registrations: QualificationRegistrationState[];
};

export type QualificationRegistrationState = {
  id: string;
  number: number;
  name: string | null;

  score: number;
  eliminated: boolean;

  competitors: {
    id: string;
    name: string;
  }[];
};
