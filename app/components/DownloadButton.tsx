"use client";

import { Download } from "lucide-react";
import type { DownloadButtonProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
    <Button
      onClick={handleDownload}
      size="lg"
      variant="default"
      className={`w-full ${className || ""}`}
    >
      <Download className="size-5" />
      Download
    </Button>
  );
}
