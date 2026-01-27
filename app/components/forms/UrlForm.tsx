"use client";

import { Input } from "@gmook9/pristine-ui";

type UrlFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function UrlForm({ value, onChange }: UrlFormProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300" htmlFor="qr-url">
        URL
      </label>
      <Input
        id="qr-url"
        placeholder="https://example.com"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-xs text-zinc-500">Paste a link to generate a QR code.</p>
    </div>
  );
}
