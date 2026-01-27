"use client";

import { Input } from "@gmook9/pristine-ui";

type ContactFormProps = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
  showAdditional: boolean;
  onChange: (field: string, value: string) => void;
  onToggleAdditional: () => void;
};

export default function ContactForm({
  firstName,
  lastName,
  phone,
  email,
  company,
  title,
  website,
  address,
  showAdditional,
  onChange,
  onToggleAdditional,
}: ContactFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="contact-first">
            First Name
          </label>
          <Input
            id="contact-first"
            placeholder="John"
            value={firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="contact-last">
            Last Name
          </label>
          <Input
            id="contact-last"
            placeholder="Doe"
            value={lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="contact-phone">
          Phone
        </label>
        <Input
          id="contact-phone"
          placeholder="+1 234 567 8900"
          value={phone}
          onChange={(event) => onChange("phone", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="contact-email">
          Email
        </label>
        <Input
          id="contact-email"
          placeholder="john@example.com"
          value={email}
          onChange={(event) => onChange("email", event.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={onToggleAdditional}
        className="text-sm font-medium text-rose-300 hover:text-rose-200"
      >
        {showAdditional ? "Hide additional fields" : "Show additional fields"}
      </button>

      {showAdditional ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300" htmlFor="contact-company">
                Company
              </label>
              <Input
                id="contact-company"
                placeholder="Company"
                value={company}
                onChange={(event) => onChange("company", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300" htmlFor="contact-title">
                Job Title
              </label>
              <Input
                id="contact-title"
                placeholder="Role"
                value={title}
                onChange={(event) => onChange("title", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="contact-website">
              Website
            </label>
            <Input
              id="contact-website"
              placeholder="https://example.com"
              value={website}
              onChange={(event) => onChange("website", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="contact-address">
              Address
            </label>
            <textarea
              id="contact-address"
              rows={3}
              placeholder="Street, City, Country"
              value={address}
              onChange={(event) => onChange("address", event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
