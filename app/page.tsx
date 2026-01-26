"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Input,
} from "@gmook9/pristine-ui";
import QrCodePreview from "./components/QrCodePreview";
import Squares from "./components/Squares";

export default function Home() {
  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const normalizedUrl = useMemo(() => url.trim(), [url]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222222"
        />
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14">
        <section className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <span className="text-xl font-bold">CL</span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Coldlink
            </p>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Create QR codes from any link in seconds.
          </h1>
          <p className="max-w-2xl text-base text-zinc-400 sm:text-lg">
            Paste a URL, generate a crisp QR code, and download it instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge className="bg-emerald-500/15 text-emerald-200">100% Free</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">No Signup</Badge>
            <Badge className="bg-blue-500/15 text-blue-200">Instant Download</Badge>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-zinc-900/70 bg-zinc-900/40">
            <CardHeader>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Generate your QR code</h2>
                <p className="text-sm text-zinc-400">
                  Enter a link below. We’ll generate a QR code for download.
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="qr-url">
                  URL
                </label>
                <Input
                  id="qr-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
                <p className="text-xs text-zinc-500">
                  The QR code will encode exactly what you paste here.
                </p>
              </div>

              <Divider />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  disabled={!normalizedUrl}
                  onClick={() => setGeneratedUrl(normalizedUrl)}
                >
                  Generate
                </Button>
                {generatedUrl ? (
                  <div className="rounded-full bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
                    Encoded URL: {generatedUrl}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <QrCodePreview value={generatedUrl} />
        </section>
      </main>
    </div>
  );
}
