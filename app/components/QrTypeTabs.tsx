"use client";

import { CalendarDays, Link, Mail, MapPin, MessageSquare, Phone, Text, User, Wifi, Bitcoin } from "lucide-react";

export type QrType =
  | "url"
  | "text"
  | "wifi"
  | "contact"
  | "email"
  | "phone"
  | "sms"
  | "location"
  | "event"
  | "crypto";

type TabConfig = {
  value: QrType;
  label: string;
  icon: typeof Link;
};

const tabs: TabConfig[] = [
  { value: "url", label: "URL", icon: Link },
  { value: "text", label: "Text", icon: Text },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "contact", label: "Contact", icon: User },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "location", label: "Location", icon: MapPin },
  { value: "event", label: "Event", icon: CalendarDays },
  { value: "crypto", label: "Crypto", icon: Bitcoin },
];

const rows = [tabs.slice(0, 5), tabs.slice(5)];

type QrTypeTabsProps = {
  value: QrType;
  onChange: (next: QrType) => void;
};

export default function QrTypeTabs({ value, onChange }: QrTypeTabsProps) {
  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={`row-${index}`} className="flex flex-wrap gap-2">
          {row.map((tab) => {
            const Icon = tab.icon;
            const isActive = value === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChange(tab.value)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? "border-zinc-800 bg-zinc-950/70 text-white"
                    : "border-zinc-700/70 bg-zinc-900/40 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      ))}
      <div className="text-xs text-zinc-400">
        Select a QR code type to customize the content.
      </div>
    </div>
  );
}
