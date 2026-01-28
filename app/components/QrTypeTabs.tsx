"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Link,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Text,
  User,
  Wifi,
  Bitcoin,
} from "lucide-react";

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

type QrTypeTabsProps = {
  value: QrType;
  onChange: (next: QrType) => void;
};

export default function QrTypeTabs({ value, onChange }: QrTypeTabsProps) {
  const [open, setOpen] = useState(false);
  const activeTab = tabs.find((tab) => tab.value === value) ?? tabs[0];
  const ActiveIcon = activeTab.icon;

  return (
    <div className="space-y-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm font-medium text-zinc-100 shadow-sm transition hover:border-zinc-600"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="flex items-center gap-2">
            <ActiveIcon className="h-4 w-4" />
            {activeTab.label}
          </span>
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open ? (
          <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-lg backdrop-blur">
            <div className="grid gap-2 sm:grid-cols-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.value === value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      onChange(tab.value);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="text-xs text-zinc-400">
        Select a QR code type to customize the content.
      </div>
    </div>
  );
}
