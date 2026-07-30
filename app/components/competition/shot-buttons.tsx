import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import type { Shot } from "@/types/qualification";

interface ShotButtonProps {
  value: Shot | null;
}

export function ShotButtons({ value }: ShotButtonProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={"outline"}
        className={`rounded-sm font-bold
          ${value === true ? "bg-emerald-500 border-emerald-400 text-slate-950" : "border-slate-700 text-slate-500 hover:bg-emerald-400 hover:border-emerald-300 hover:text-emerald-100"}
        `}
        size={"lg"}
      >
        <Check />
      </Button>
      <Button
        variant={"outline"}
        size={"lg"}
        className={`rounded-sm font-bold
          ${value === false ? "bg-rose-500 border-rose-400 text-slate-950" : "border-slate-700 text-slate-500 hover:bg-rose-400 hover:border-rose-300 hover:text-rose-100"} 
        `}
      >
        <X />
      </Button>
    </div>
  );
}
