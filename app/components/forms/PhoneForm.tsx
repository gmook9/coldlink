"use client";

import { Input } from "@gmook9/pristine-ui";

type PhoneFormProps = {
  phone: string;
  onChange: (value: string) => void;
};

export default function PhoneForm({ phone, onChange }: PhoneFormProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300" htmlFor="phone-number">
        Phone Number
      </label>
      <Input
        id="phone-number"
        placeholder="+1 909 090 0909"
        value={phone}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-xs text-zinc-500">Include country code for international calls.</p>
    </div>
  );
}
