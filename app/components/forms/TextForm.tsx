"use client";

type TextFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextForm({ value, onChange }: TextFormProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300" htmlFor="qr-text">
        Text
      </label>
      <textarea
        id="qr-text"
        rows={4}
        placeholder="Type anything you want to share"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
      />
      <p className="text-xs text-zinc-500">Plain text, notes, or a short message.</p>
    </div>
  );
}
