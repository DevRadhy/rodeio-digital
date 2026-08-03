import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import type { Shot } from "@/types/competition";

interface ShotButtonProps {
  value: Shot | null;
  setShot: (value: Shot) => void;
  disabled?: boolean;
}

export function ShotButtons({
  value,
  setShot,
  disabled = false,
}: ShotButtonProps) {
  const onSetShot = (shot: boolean) => {
    setShot(shot === value ? null : shot);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={"outline"}
        disabled={disabled}
        onClick={() => onSetShot(true)}
        className={`${value === true ? "bg-emerald-500 outline-emerald-400 text-emerald-100" : "outline-slate-400 text-slate-400 "}
          rounded-sm font-bold w-12 h-10 px-3.5 flex justify-center items-center outline
          hover:bg-emerald-400 hover:outline-emerald-300 hover:text-emerald-100
        `}
      >
        <Check />
      </Button>
      <Button
        variant={"outline"}
        disabled={disabled}
        onClick={() => onSetShot(false)}
        className={`${value === false ? "bg-rose-500 outline-rose-400 text-rose-100" : "outline-slate-400 text-slate-400"} 
          rounded-sm font-bold w-12 h-10 px-3.5 flex justify-center items-center outline 
          hover:bg-rose-400 hover:outline-rose-300 hover:text-rose-100
        `}
      >
        <X />
      </Button>
    </div>
  );
}
