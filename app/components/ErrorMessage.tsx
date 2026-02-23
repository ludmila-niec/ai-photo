"use client";

import type { ErrorMessageProps } from "@/lib/types";

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="text-red-500 text-2xl">!</div>
        <p className="text-red-700 font-medium">Something went wrong</p>
        <p className="text-sm text-red-600">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
