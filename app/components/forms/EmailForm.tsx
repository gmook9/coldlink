"use client";

import { Input } from "@gmook9/pristine-ui";

type EmailFormProps = {
  address: string;
  subject: string;
  body: string;
  onChange: (field: "address" | "subject" | "body", value: string) => void;
};

export default function EmailForm({ address, subject, body, onChange }: EmailFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email-address">
          Email
        </label>
        <Input
          id="email-address"
          placeholder="hello@example.com"
          value={address}
          onChange={(event) => onChange("address", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email-subject">
          Subject
        </label>
        <Input
          id="email-subject"
          placeholder="A quick question"
          value={subject}
          onChange={(event) => onChange("subject", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email-body">
          Message
        </label>
        <textarea
          id="email-body"
          rows={4}
          placeholder="Write your email body"
          value={body}
          onChange={(event) => onChange("body", event.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
        />
      </div>
    </div>
  );
}
