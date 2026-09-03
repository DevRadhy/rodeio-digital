import { Circle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Shot } from "../types/competition";

interface ShotButtonProps {
  value: Shot | null;
  disabled?: boolean;
  setShot: (value: Shot) => void;
}

export function ShotButtons({
  value,
  disabled = false,
  setShot,
}: ShotButtonProps) {
  const onSetShot = (shot: Shot) => {
    if (shot === value) return;

    setShot(shot);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={"outline"}
        disabled={disabled}
        onClick={() => onSetShot("positive")}
        aria-label="Marcar acerto"
        aria-pressed={value === "positive"}
        className={`h-10 w-12 rounded-lg px-3.5 transition-colors ${value === "positive" ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary"}`}
      >
        <X />
      </Button>
      <Button
        variant={"outline"}
        disabled={disabled}
        onClick={() => onSetShot("negative")}
        aria-label="Marcar erro"
        aria-pressed={value === "negative"}
        className={`h-10 w-12 rounded-lg px-3.5 transition-colors ${value === "negative" ? "border-negative bg-negative text-negative-foreground hover:bg-negative/90 hover:text-negative-foreground" : "border-border bg-card text-muted-foreground hover:border-negative hover:bg-negative/10 hover:text-negative"}`}
      >
        <Circle />
      </Button>
    </div>
  );
}
