export interface CompetitionShotRegisteredEvent {
  type: "competition.shot.registered";

  payload: {
    competitionId: string;

    group: {
      id: string;
      status: "not_started" | "running" | "finished";
    };

    round: {
      id: string;
      number: number;
      status: "not_started" | "running" | "finished";
      startedAt: string | null;
    };

    result: {
      id: string;
      registrationId: string;
    };

    competitor: {
      id: string;
      shot: "positive" | "negative";
    };
  };
}
