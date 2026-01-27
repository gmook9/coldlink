"use client";

import { Input } from "@gmook9/pristine-ui";

type LocationFormProps = {
  latitude: string;
  longitude: string;
  onChange: (field: "latitude" | "longitude", value: string) => void;
  onUseCurrent: () => void;
};

export default function LocationForm({
  latitude,
  longitude,
  onChange,
  onUseCurrent,
}: LocationFormProps) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onUseCurrent}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm font-medium text-zinc-200 shadow-sm transition hover:border-zinc-700!"
      >
        Use my current location
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="location-lat">
            Latitude
          </label>
          <Input
            id="location-lat"
            placeholder="34.1639"
            value={latitude}
            onChange={(event) => onChange("latitude", event.target.value)}
          />
          <p className="text-xs text-zinc-500">-90 to 90</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="location-lon">
            Longitude
          </label>
          <Input
            id="location-lon"
            placeholder="118.0483"
            value={longitude}
            onChange={(event) => onChange("longitude", event.target.value)}
          />
          <p className="text-xs text-zinc-500">-180 to 180</p>
        </div>
      </div>
    </div>
  );
}
