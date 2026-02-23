"use client";

import { Sparkles, CircleHelp, CircleCheck, CircleX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-primary">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              RevAIve
            </span>
          </Link>

          <button
            onClick={() => setTipsOpen(true)}
            className="flex items-center gap-1.5 text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
          >
            <CircleHelp className="size-4" />
            <span className="text-sm font-medium">Tips</span>
          </button>
        </div>
      </nav>

      <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-arvo">
              Tips for Best Results
            </DialogTitle>
          </DialogHeader>

          {/* Do's section */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full flex items-center justify-center shrink-0">
                <CircleCheck className="size-5 text-primary" />
              </div>
              <span className="text-lg font-semibold">Do&apos;s</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground indent-10">
              <li className="flex items-start gap-2">
                <span>Use high-resolution scans of photos</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Ensure good lighting when scanning</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Upload images with clear subjects</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Keep file sizes under 10MB</span>
              </li>
            </ul>
          </div>

          {/* Don'ts section */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full flex items-center justify-center shrink-0">
                <CircleX className="size-5 text-primary" />
              </div>
              <span className="text-lg font-semibold">Don&apos;ts</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground indent-10">
              <li className="flex items-start gap-2">
                <span>Don&apos;t upload heavily compressed images</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Don&apos;t use photos that are too blurry</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Don&apos;t expect miracles from very damaged photos</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Don&apos;t upload screenshots or digital photos</span>
              </li>
            </ul>
          </div>



          {/* Rights notice */}
          <div className="border-extract p-8">
            <p className="text-sm">
              <span className="font-bold font-arvo block mb-2">Important: </span>
              <span className="text-sm">
                Only upload images you own or have permission to use. Do not upload photos that infringe on copyright or the rights of public figures. By uploading, you confirm you hold the necessary rights to the image.
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
