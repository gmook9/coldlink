"use client";

import { Input } from "@gmook9/pristine-ui";

type WifiFormProps = {
  ssid: string;
  security: "wpa" | "wep" | "nopass";
  password: string;
  hidden: boolean;
  onSsidChange: (value: string) => void;
  onSecurityChange: (value: "wpa" | "wep" | "nopass") => void;
  onPasswordChange: (value: string) => void;
  onHiddenChange: (value: boolean) => void;
};

export default function WifiForm({
  ssid,
  security,
  password,
  hidden,
  onSsidChange,
  onSecurityChange,
  onPasswordChange,
  onHiddenChange,
}: WifiFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="wifi-ssid">
          Network Name (SSID)
        </label>
        <Input
          id="wifi-ssid"
          placeholder="MyWiFiNetwork"
          value={ssid}
          onChange={(event) => onSsidChange(event.target.value)}
        />
        <p className="text-xs text-zinc-500">Enter your WiFi network name.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="wifi-security">
          Security Type
        </label>
        <select
          id="wifi-security"
          value={security}
          onChange={(event) => onSecurityChange(event.target.value as "wpa" | "wep" | "nopass")}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900"
        >
          <option value="wpa">WPA/WPA2/WPA3</option>
          <option value="wep">WEP</option>
          <option value="nopass">No Password</option>
        </select>
      </div>

      {security !== "nopass" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="wifi-password">
            Password
          </label>
          <Input
            id="wifi-password"
            placeholder="Enter WiFi password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
          />
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={hidden}
          onChange={(event) => onHiddenChange(event.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-200"
        />
        Hidden network
      </label>
    </div>
  );
}
