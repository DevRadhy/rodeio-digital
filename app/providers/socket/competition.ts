import { socket } from ".";

export function connectCompetitionSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectCompetitionSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export function joinCompetition(sessionId: string) {
  socket.emit("competition.join", {
    sessionId,
  });
}

export function leaveCompetition(sessionId: string) {
  socket.emit("competition.leave", {
    sessionId,
  });
}
