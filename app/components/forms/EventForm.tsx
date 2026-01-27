"use client";

import { Input } from "@gmook9/pristine-ui";

type EventFormProps = {
  title: string;
  location: string;
  start: string;
  end: string;
  description: string;
  onChange: (
    field: "title" | "location" | "start" | "end" | "description",
    value: string
  ) => void;
};

export default function EventForm({
  title,
  location,
  start,
  end,
  description,
  onChange,
}: EventFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="event-title">
          Event Title
        </label>
        <Input
          id="event-title"
          placeholder="Team Meeting"
          value={title}
          onChange={(event) => onChange("title", event.target.value)}
        />
        <p className="text-xs text-zinc-500">The name of your event.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="event-location">
          Location (optional)
        </label>
        <Input
          id="event-location"
          placeholder="Conference Room A"
          value={location}
          onChange={(event) => onChange("location", event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="event-start">
            Start Date & Time
          </label>
          <Input
            id="event-start"
            type="datetime-local"
            value={start}
            onChange={(event) => onChange("start", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="event-end">
            End Date & Time
          </label>
          <Input
            id="event-end"
            type="datetime-local"
            value={end}
            onChange={(event) => onChange("end", event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="event-description">
          Description (optional)
        </label>
        <textarea
          id="event-description"
          rows={3}
          placeholder="Add event details..."
          value={description}
          onChange={(event) => onChange("description", event.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
        />
      </div>
    </div>
  );
}
