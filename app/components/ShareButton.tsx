"use client";

import { useCallback } from "react";
import { Share2 } from "lucide-react";
import type { ShareButtonProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr], { type: mime });
}

export function ShareButton({ dataUrl }: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    const blob = dataUrlToBlob(dataUrl);
    const file = new File([blob], `restored-${Date.now()}.png`, {
      type: blob.type,
    });

    // Try native share with file
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {
        // User cancelled or share failed — fall through
      }
    }

    // Try clipboard
    if (navigator.clipboard?.write) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        return;
      } catch {
        // Clipboard write failed — fall through
      }
    }

    // Fallback: trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `restored-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [dataUrl]);

  return (
    <Button
      onClick={handleShare}
      size="icon-lg"
      variant="outline"
      aria-label="Share restored photo"
      className="rounded-full "
    >
      <Share2 className="size-5" />
    </Button>
  );
}
