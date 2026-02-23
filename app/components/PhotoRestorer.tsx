"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { UploadZone } from "./UploadZone";
import { PresetSelector } from "./PresetSelector";
import { ProcessingSpinner } from "./ProcessingSpinner";
import { CompareView } from "./CompareView";
import { DownloadButton } from "./DownloadButton";
import { ShareButton } from "./ShareButton";
import { restorePhoto } from "@/app/actions/restore";
import type { Preset, AppState, RestoreResponse } from "@/lib/types";
import Image from "next/image";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";

interface State {
  status: AppState;
  selectedFile: File | null;
  originalUrl: string | null;
  restoredUrl: string | null;
  preset: Preset;
  errorMessage: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  spinnerExiting: boolean;
}

const initialState: State = {
  status: "idle",
  selectedFile: null,
  originalUrl: null,
  restoredUrl: null,
  preset: "restore-only",
  errorMessage: null,
  imageWidth: null,
  imageHeight: null,
  spinnerExiting: false,
};

export function PhotoRestorer() {
  const [state, setState] = useState<State>(initialState);
  const pendingResultRef = useRef<RestoreResponse | null>(null);

  useEffect(() => {
    return () => {
      if (state.originalUrl) {
        URL.revokeObjectURL(state.originalUrl);
      }
    };
  }, [state.originalUrl]);

  useEffect(() => {
    if (!state.spinnerExiting) return;
    const timer = setTimeout(() => {
      const result = pendingResultRef.current;
      pendingResultRef.current = null;
      if (result && result.success) {
        const restoredUrl = `data:${result.mimeType};base64,${result.imageData}`;
        setState((s) => ({ ...s, status: "success", restoredUrl, spinnerExiting: false }));
      } else {
        setState((s) => ({
          ...s,
          status: "error",
          errorMessage: result ? result.error : "An error occurred",
          spinnerExiting: false,
        }));
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [state.spinnerExiting]);

  const selectFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setState((s) => ({
      ...s,
      selectedFile: file,
      originalUrl: url,
      errorMessage: null,
      imageWidth: null,
      imageHeight: null,
    }));
    const img = new window.Image();
    img.onload = () => {
      setState((s) => ({
        ...s,
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
      }));
    };
    img.src = url;
  }, []);

  const setPreset = useCallback((preset: Preset) => {
    setState((s) => ({ ...s, preset }));
  }, []);

  const startProcessing = useCallback(async () => {
    if (!state.selectedFile) return;

    setState((s) => ({ ...s, status: "uploading" }));

    const formData = new FormData();
    formData.append("file", state.selectedFile);
    formData.append("preset", state.preset);

    setState((s) => ({ ...s, status: "processing" }));

    const result = await restorePhoto(formData);
    pendingResultRef.current = result;
    setState((s) => ({ ...s, spinnerExiting: true }));
  }, [state.selectedFile, state.preset]);

  const reset = useCallback(() => {
    if (state.originalUrl) {
      URL.revokeObjectURL(state.originalUrl);
    }
    setState(initialState);
  }, [state.originalUrl]);

  const clearFile = useCallback(() => {
    if (state.originalUrl) {
      URL.revokeObjectURL(state.originalUrl);
    }
    setState((s) => ({
      ...s,
      selectedFile: null,
      originalUrl: null,
      imageWidth: null,
      imageHeight: null,
    }));
  }, [state.originalUrl]);

  const isProcessing = state.status === "uploading" || state.status === "processing";

  if (state.status === "success" && state.originalUrl && state.restoredUrl) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="size-16 rounded-full bg-[rgba(0,201,80,0.1)] flex items-center justify-center">
            <CircleCheck className="size-8 text-[#00C950]" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Restoration Complete!</h2>
          <p className="text-sm text-muted-foreground">Your photo has been restored successfully</p>
        </div>
        <CompareView originalUrl={state.originalUrl} restoredUrl={state.restoredUrl} />
        <div className="flex gap-3">
          <DownloadButton dataUrl={state.restoredUrl} className="flex-1" />
          <ShareButton dataUrl={state.restoredUrl} />
        </div>
        <button
          onClick={reset}
          className="w-full h-12 flex items-center justify-center gap-2 text-foreground rounded-[42px] font-medium hover:bg-muted transition-colors cursor-pointer"
        >
          <RotateCcw className="size-4" />
          Restore Another Photo
        </button>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <div className="space-y-6 w-full max-w-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <CircleX className="size-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Something Went Wrong</h2>
            <p className="text-sm text-muted-foreground text-center">
              {state.errorMessage || "An error occurred"}
            </p>
          </div>

          <button
            onClick={reset}
            className="bg-primary text-primary-foreground rounded-[10px] h-12 w-full text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <ProcessingSpinner preset={state.preset} exiting={state.spinnerExiting} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-[30px] font-[family-name:var(--font-arvo)] font-bold text-foreground">
          Restore Your Old Photos
        </h1>
        <p className="mt-3 text-base">
          Bring your memories back to life with AI-powered restoration
        </p>
      </div>
      {state.selectedFile && state.originalUrl ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-[25px] flex flex-col gap-6">
          <Image
            src={state.originalUrl}
            alt="Selected photo"
            width={state.imageWidth || 800}
            height={state.imageHeight || 600}
            className="w-full h-auto rounded-xl"
            unoptimized
          />
          <button
            type="button"
            onClick={clearFile}
            className="bg-background border border-border rounded-[10px] px-3 h-8 text-sm font-medium text-foreground self-center hover:bg-muted transition-colors cursor-pointer"
          >
            Change Photo
          </button>
          <PresetSelector
            value={state.preset}
            onChange={setPreset}
            disabled={isProcessing}
          />
          <button
            onClick={startProcessing}
            disabled={isProcessing}
            className="bg-primary text-primary-foreground rounded-[10px] h-12 w-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Restore Photo
          </button>
        </div>
      ) : (
        <UploadZone onFileSelect={selectFile} disabled={isProcessing} />
      )}
      <h2 className="text-[20px] font-[family-name:var(--font-arvo)] font-bold text-foreground text-center mt-12">Check this example</h2>
      <CompareView
        originalUrl="/example-original.png"
        restoredUrl="/example-restored.png"
      />
    </div>
  );
}
