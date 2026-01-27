"use client";

import { Input } from "@gmook9/pristine-ui";
import { Bitcoin, Coins } from "lucide-react";

type CryptoFormProps = {
  network: "bitcoin" | "ethereum";
  address: string;
  amount: string;
  onNetworkChange: (value: "bitcoin" | "ethereum") => void;
  onChange: (field: "address" | "amount", value: string) => void;
};

export default function CryptoForm({
  network,
  address,
  amount,
  onNetworkChange,
  onChange,
}: CryptoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-300">Cryptocurrency</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onNetworkChange("bitcoin")}
            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              network === "bitcoin"
                ? "border-orange-300! bg-orange-500/30 text-orange-200! shadow-sm"
                : "border-zinc-700 bg-zinc-950/60 text-zinc-300 hover:border-zinc-500 hover:bg-orange-500/10"
            }`}
          >
            <Bitcoin className="h-4 w-4" />
            Bitcoin
          </button>
          <button
            type="button"
            onClick={() => onNetworkChange("ethereum")}
            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              network === "ethereum"
                ? "border-blue-400/70! bg-indigo-500/30 text-indigo-200! shadow-sm"
                : "border-zinc-700 bg-zinc-950/60 text-zinc-300 hover:border-zinc-500 hover:bg-indigo-500/10"
            }`}
          >
            <Coins className="h-4 w-4" />
            Ethereum
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="crypto-address">
          {network === "bitcoin" ? "Bitcoin Address" : "Ethereum Address"}
        </label>
        <Input
          id="crypto-address"
          placeholder={network === "bitcoin" ? "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" : "0x0000000000000000000000000000000000000000"}
          value={address}
          onChange={(event) => onChange("address", event.target.value)}
        />
        {network === "bitcoin" ? (
          <p className="text-xs text-zinc-500">Supports legacy, SegWit, and native SegWit addresses.</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="crypto-amount">
          Amount ({network === "bitcoin" ? "BTC" : "ETH"}) - Optional
        </label>
        <Input
          id="crypto-amount"
          placeholder={network === "bitcoin" ? "0.001" : "0.25"}
          value={amount}
          onChange={(event) => onChange("amount", event.target.value)}
        />
        <p className="text-xs text-zinc-500">Pre-fill an amount for the payment request.</p>
      </div>
    </div>
  );
}
