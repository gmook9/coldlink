"use client";

import { Download, Copy } from "lucide-react";

type DownloadOptionsProps = {
  resolution: number;
  onResolutionChange: (value: number) => void;
  activeFormat: "png" | "svg" | "jpeg";
  onDownload: (format: "png" | "svg" | "jpeg") => void;
  onCopy: () => void;
  isReady: boolean;
};

const resolutions = [256, 512, 1024, 2048];

export default function DownloadOptions({
  resolution,
  onResolutionChange,
  activeFormat,
  onDownload,
  onCopy,
  isReady,
}: DownloadOptionsProps) {
  return (
    <div className="rounded-2xl border border-zinc-900/70 bg-zinc-900/40 p-6 text-zinc-100">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">Download QR Code</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="qr-resolution">
            Resolution
          </label>
          <select
            id="qr-resolution"
            value={resolution}
            onChange={(event) => onResolutionChange(Number(event.target.value))}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
          >
            {resolutions.map((option) => (
              <option key={option} value={option}>
                {option} x {option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onDownload("png")}
            disabled={!isReady}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeFormat === "png"
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-200"
            } ${isReady ? "hover:bg-blue-500" : "cursor-not-allowed opacity-60"}`}
          >
            <Download className="h-4 w-4" />
            PNG
          </button>
          <button
            type="button"
            onClick={() => onDownload("svg")}
            disabled={!isReady}
            className={`flex items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-300 transition ${
              activeFormat === "svg" ? "bg-zinc-900 text-white" : "bg-zinc-950/60"
            } ${isReady ? "hover:border-zinc-700" : "cursor-not-allowed opacity-60"}`}
          >
            <Download className="h-4 w-4" />
            SVG
          </button>
          <button
            type="button"
            onClick={() => onDownload("jpeg")}
            disabled={!isReady}
            className={`flex items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-300 transition ${
              activeFormat === "jpeg" ? "bg-zinc-900 text-white" : "bg-zinc-950/60"
            } ${isReady ? "hover:border-zinc-700" : "cursor-not-allowed opacity-60"}`}
          >
            <Download className="h-4 w-4" />
            JPEG
          </button>
          <button
            type="button"
            onClick={onCopy}
            disabled={!isReady}
            className={`flex items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-300 transition ${
              isReady ? "hover:border-zinc-700" : "cursor-not-allowed opacity-60"
            }`}
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          PNG & JPEG use the selected resolution. SVG is vector-based.
        </p>
      </div>
    </div>
  );
}
