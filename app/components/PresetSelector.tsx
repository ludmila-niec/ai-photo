"use client";

import { PRESET_OPTIONS } from "@/lib/presets";
import type { PresetSelectorProps } from "@/lib/types";
import { Wrench, Palette } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "restore-only": Wrench,
  "restore-colorize": Palette,
};

const VISIBLE_PRESETS = ["restore-only", "restore-colorize"];

export function PresetSelector({ value, onChange, disabled }: PresetSelectorProps) {
  const filteredOptions = PRESET_OPTIONS.filter((o) =>
    VISIBLE_PRESETS.includes(o.value)
  );

  return (
    <div className="flex flex-col gap-4">
      {filteredOptions.map((option) => {
        const Icon = ICON_MAP[option.value];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              border-2 border-primary rounded-sm p-4 flex gap-4 items-center text-left transition-colors 
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${isSelected ? "bg-primary/5" : " border-primary/50 hover:bg-primary/5"}
            `}
          >
            <div className={`rounded-xl size-12 flex items-center border border-primary justify-center shrink-0  ${isSelected ? "bg-primary" : "bg-transparent"}`}>
              {Icon && <Icon className={`size-5 ${isSelected ? "text-background" : "text-primary"}`} />}
            </div>
            <div>
              <div className={`text-sm ${isSelected ? "font-bold" : "text-medium"} font-arvo`}>{option.label}</div>
              <div className="text-sm font-medium">{option.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
