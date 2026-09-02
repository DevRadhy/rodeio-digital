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
        className={`${value === "positive" ? "bg-emerald-400 outline-emerald-300 text-emerald-100" : "outline-slate-400 text-slate-400 "}
          rounded-sm font-bold w-12 h-10 px-3.5 flex justify-center items-center outline
          hover:bg-emerald-300 hover:outline-emerald-400 hover:text-emerald-100
        `}
      >
        <X />
      </Button>
      <Button
        variant={"outline"}
        disabled={disabled}
        onClick={() => onSetShot("negative")}
        aria-label="Marcar erro"
        aria-pressed={value === "negative"}
        className={`${value === "negative" ? "bg-rose-400 outline-rose-300 text-rose-100" : "outline-slate-400 text-slate-400"} 
          rounded-sm font-bold w-12 h-10 px-3.5 flex justify-center items-center outline 
          hover:bg-rose-300 hover:outline-rose-400 hover:text-rose-100
        `}
      >
        <Circle />
      </Button>
    </div>
  );
}
