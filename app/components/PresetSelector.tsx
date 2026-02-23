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
              border-2 rounded-xl p-4 flex gap-4 items-center text-left transition-colors
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${isSelected ? "border-primary bg-primary/5" : "border-border"}
            `}
          >
            <div className="bg-[#3a3a3a] rounded-xl size-12 flex items-center justify-center shrink-0">
              {Icon && <Icon className="size-5 text-foreground" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{option.label}</div>
              <div className="text-sm font-medium text-muted-foreground">{option.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
