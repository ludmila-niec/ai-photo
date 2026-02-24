"use client";

import { Download } from "lucide-react";
import type { DownloadButtonProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DownloadButton({ dataUrl, filename, className }: DownloadButtonProps) {
  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename || `restored-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Photo downloaded successfully", { position: "top-right" });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photo", { position: "top-right" });
    }
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
