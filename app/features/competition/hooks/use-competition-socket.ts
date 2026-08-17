import { useEffect } from "react";
import { socket } from "@/providers/socket";
import {
  connectCompetitionSocket,
  disconnectCompetitionSocket,
  joinCompetition,
  leaveCompetition,
} from "@/providers/socket/competition";

interface useCompetitionSocketProps {
  sessionId: string;
}

interface CompetitionJoinedPayload {
  sessionId: string;
}

interface CompetitionLeftPayload {
  sessionId: string;
}

export function useCompetitionSocket({ sessionId }: useCompetitionSocketProps) {
  useEffect(() => {
    connectCompetitionSocket();

    joinCompetition(sessionId);

    return () => {
      leaveCompetition(sessionId);
      disconnectCompetitionSocket();
    };
  }, [sessionId]);

  useEffect(() => {
    function handleJoined(event: CompetitionJoinedPayload) {
      if (event.sessionId !== sessionId) {
        return;
      }

      console.log("Juiz entrou na competição:", event.sessionId);
    }

    function handleLeft(event: CompetitionLeftPayload) {
      if (event.sessionId !== sessionId) {
        return;
      }

      console.log("Juiz saiu da competição:", event.sessionId);
    }

    socket.on("competition.joined", handleJoined);

    socket.on("competition.left", handleLeft);

    return () => {
      socket.off("competition.joined", handleJoined);

      socket.off("competition.left", handleLeft);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("competition.join", { sessionId });

    return () => {
      socket.emit("competition.leave", { sessionId });

      socket.disconnect();
    };
  }, [sessionId]);
}
