"use client";

import { Download } from "lucide-react";
import type { DownloadButtonProps } from "@/lib/types";

export function DownloadButton({ dataUrl, filename, className }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename || `restored-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className={`bg-primary text-primary-foreground rounded-[42px] h-12 flex items-center justify-center gap-2 font-medium hover:bg-primary/90 transition-colors cursor-pointer ${className || ""}`}
    >
      <Download className="size-5" />
      Download
    </button>
  );
}
