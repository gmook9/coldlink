"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, Divider } from "@gmook9/pristine-ui";
import { QrCode } from "lucide-react";

type QrCodePreviewProps = {
  value: string;
  size?: number;
  format?: "png" | "jpeg" | "svg";
  foregroundColor?: string;
  backgroundColor?: string;
  onDataUrlChange?: (dataUrl: string, fileName: string, mimeType: string) => void;
};

export default function QrCodePreview({
  value,
  size = 240,
  format = "png",
  foregroundColor = "#111111",
  backgroundColor = "#ffffff",
  onDataUrlChange,
}: QrCodePreviewProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedValue = useMemo(() => value.trim(), [value]);
  const extension = format === "jpeg" ? "jpg" : format;
  const downloadName = normalizedValue
    ? `qrcode-${normalizedValue.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.${extension}`
    : `qrcode.${extension}`;

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      if (!normalizedValue) {
        setDataUrl("");
        setError(null);
        onDataUrlChange?.("", "", "");
        return;
      }

      setIsLoading(true);
      try {
        let nextDataUrl = "";
        let mimeType = "";

        const color = { dark: foregroundColor, light: backgroundColor };

        if (format === "svg") {
          const svgString = await QRCode.toString(normalizedValue, {
            margin: 1,
            width: size,
            errorCorrectionLevel: "M",
            color,
            type: "svg",
          });
          const encoded = window.btoa(unescape(encodeURIComponent(svgString)));
          nextDataUrl = `data:image/svg+xml;base64,${encoded}`;
          mimeType = "image/svg+xml";
        } else {
          const type = format === "jpeg" ? "image/jpeg" : "image/png";
          nextDataUrl = await QRCode.toDataURL(normalizedValue, {
            margin: 1,
            width: size,
            errorCorrectionLevel: "M",
            color,
            type,
          });
          mimeType = type;
        }

        if (isActive) {
          setDataUrl(nextDataUrl);
          setError(null);
          onDataUrlChange?.(nextDataUrl, downloadName, mimeType);
        }
      } catch (err) {
        if (isActive) {
          setError("Unable to generate QR code. Please try a different link.");
          onDataUrlChange?.("", "", "");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [
    normalizedValue,
    size,
    format,
    foregroundColor,
    backgroundColor,
    onDataUrlChange,
    downloadName,
  ]);

  return (
    <Card className="h-full border border-zinc-900/70 bg-zinc-900/40 text-zinc-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview</h2>
          <span className="text-xs text-zinc-400">
            {format.toUpperCase()} • {size}px
          </span>
        </div>
      </CardHeader>
      <Divider />
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-sm">
          {isLoading ? (
            <div className="animate-pulse text-sm text-zinc-400">Generating…</div>
          ) : dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt="Generated QR code"
              className="h-56 w-56"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
                <QrCode className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-200">
                  Enter content then click Generate
                </p>
                <p className="text-xs text-zinc-500">to view your QR code.</p>
              </div>
            </div>
          )}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
