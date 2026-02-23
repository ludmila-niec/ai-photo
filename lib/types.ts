export type Preset = "restore-colorize" | "restore-only" | "colorize-only" | "enhance";

export type AppState = "idle" | "uploading" | "processing" | "success" | "error";

export interface RestoreResult {
  success: true;
  imageData: string;
  mimeType: string;
}

export interface RestoreError {
  success: false;
  error: string;
}

export type RestoreResponse = RestoreResult | RestoreError;

export interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export interface PresetSelectorProps {
  value: Preset;
  onChange: (preset: Preset) => void;
  disabled: boolean;
}

export interface CompareViewProps {
  originalUrl: string;
  restoredUrl: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export interface DownloadButtonProps {
  dataUrl: string;
  filename?: string;
  className?: string;
}

export interface ShareButtonProps {
  dataUrl: string;
}
