"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Button, Card, CardContent, CardHeader, Divider } from "@gmook9/pristine-ui";

type QrCodePreviewProps = {
  value: string;
  size?: number;
};

export default function QrCodePreview({ value, size = 240 }: QrCodePreviewProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedValue = useMemo(() => value.trim(), [value]);

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      if (!normalizedValue) {
        setDataUrl("");
        setError(null);
        return;
      }

      setIsLoading(true);
      try {
        const nextDataUrl = await QRCode.toDataURL(normalizedValue, {
          margin: 1,
          width: size,
          errorCorrectionLevel: "M",
        });

        if (isActive) {
          setDataUrl(nextDataUrl);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          setError("Unable to generate QR code. Please try a different link.");
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
  }, [normalizedValue, size]);

  const downloadName = normalizedValue
    ? `qrcode-${normalizedValue.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.png`
    : "qrcode.png";

  const handleDownload = () => {
    if (!dataUrl || isLoading) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = downloadName;
    link.click();
  };

  return (
    <Card className="h-full border border-zinc-900/70 bg-zinc-900/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview</h2>
          <span className="text-xs text-zinc-400">PNG • {size}px</span>
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
            <div className="text-center text-sm text-zinc-400">
              Enter a link to generate your QR code.
            </div>
          )}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button
          variant="primary"
          className="w-full"
          disabled={!dataUrl || isLoading}
          onClick={handleDownload}
        >
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
