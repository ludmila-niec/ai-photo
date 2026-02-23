"use client";

import { useCallback, useState, useRef } from "react";
import { Upload } from "lucide-react";
import { validateFile } from "@/lib/validation";
import type { UploadZoneProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [disabled, handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full z-10 relative">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          rounded-sm py-10 px-6 text-center transition-colors cursor-pointer border-primary
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragging ? "border-dashed-translation bg-primary/5" : "border border-dashed"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`size-12 rounded-full border border-primary flex items-center justify-center transition-all duration-300 ${isDragging ? "scale-110" : "scale-100"}`}>
            <Upload className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-foreground">
              {isDragging ? "Drop your photo here" : "Drag and drop your photo here"}
            </p>
            <p className="text-sm text-muted-foreground">or</p>
          </div>
          <Button
            variant="default"
            size="lg"
            disabled={disabled}
          >
            Browse Files
          </Button>
          <p className="text-sm text-muted-foreground">
            Supports: JPG, PNG, WebP (Max 10MB)
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
