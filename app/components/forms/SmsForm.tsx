"use client";

import { Input } from "@gmook9/pristine-ui";

type SmsFormProps = {
  phone: string;
  message: string;
  onChange: (field: "phone" | "message", value: string) => void;
};

export default function SmsForm({ phone, message, onChange }: SmsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="sms-number">
          Phone Number
        </label>
        <Input
          id="sms-number"
          placeholder="+1 234 567 8900"
          value={phone}
          onChange={(event) => onChange("phone", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="sms-message">
          Message
        </label>
        <textarea
          id="sms-message"
          rows={4}
          placeholder="Add a message"
          value={message}
          onChange={(event) => onChange("message", event.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
        />
      </div>
    </div>
  );
}
