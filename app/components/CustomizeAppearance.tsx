"use client";

type CustomizeAppearanceProps = {
  foreground: string;
  background: string;
  onForegroundChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  onReset: () => void;
};

export default function CustomizeAppearance({
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange,
  onReset,
}: CustomizeAppearanceProps) {
  return (
    <div className="rounded-2xl border border-zinc-900/70 bg-zinc-900/40 p-6 text-zinc-100">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Customize appearance</h3>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-zinc-300">
            Foreground
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={foreground}
                onChange={(event) => onForegroundChange(event.target.value)}
                className="h-10 w-12 rounded-md border border-zinc-700 bg-zinc-950/60"
              />
              <span className="text-xs text-zinc-400">{foreground.toUpperCase()}</span>
            </div>
          </label>
          <label className="space-y-2 text-sm font-medium text-zinc-300">
            Background
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={background}
                onChange={(event) => onBackgroundChange(event.target.value)}
                className="h-10 w-12 rounded-md border border-zinc-700 bg-zinc-950/60"
              />
              <span className="text-xs text-zinc-400">{background.toUpperCase()}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
