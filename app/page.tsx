"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Toast,
  ToastAction,
  ToastDescription,
  ToastTitle,
} from "@gmook9/pristine-ui";
import { Tag, User, Zap } from "lucide-react";
import QrCodePreview from "./components/QrCodePreview";
import QrTypeTabs, { QrType } from "./components/QrTypeTabs";
import UrlForm from "./components/forms/UrlForm";
import TextForm from "./components/forms/TextForm";
import WifiForm from "./components/forms/WifiForm";
import ContactForm from "./components/forms/ContactForm";
import EmailForm from "./components/forms/EmailForm";
import PhoneForm from "./components/forms/PhoneForm";
import SmsForm from "./components/forms/SmsForm";
import LocationForm from "./components/forms/LocationForm";
import EventForm from "./components/forms/EventForm";
import CryptoForm from "./components/forms/CryptoForm";
import DownloadOptions from "./components/DownloadOptions";
import CustomizeAppearance from "./components/CustomizeAppearance";
import Squares from "./components/Squares";

const LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_GENERATIONS = 10;
const STORAGE_KEY = "coldlink_qr_generations";
const DOWNLOADS_KEY = "coldlink_qr_downloads";
const MAX_DOWNLOADS_PER_QR = 4;

const escapeWifi = (value: string) => value.replace(/[\\;,:]/g, (match) => `\\${match}`);
const escapeVCard = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const formatIcsDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

export default function Home() {
  const [activeType, setActiveType] = useState<QrType>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({
    ssid: "",
    security: "wpa" as "wpa" | "wep" | "nopass",
    password: "",
    hidden: false,
  });
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    website: "",
    address: "",
  });
  const [showContactExtras, setShowContactExtras] = useState(false);
  const [email, setEmail] = useState({ address: "", subject: "", body: "" });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sms, setSms] = useState({ phone: "", message: "" });
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [event, setEvent] = useState({
    title: "",
    location: "",
    start: "",
    end: "",
    description: "",
  });
  const [crypto, setCrypto] = useState({
    network: "bitcoin" as "bitcoin" | "ethereum",
    address: "",
    amount: "",
  });
  const [resolution, setResolution] = useState(1024);
  const [format, setFormat] = useState<"png" | "jpeg" | "svg">("png");
  const [colors, setColors] = useState({ foreground: "#111111", background: "#ffffff" });
  const [colorsDraft, setColorsDraft] = useState({
    foreground: "#111111",
    background: "#ffffff",
  });
  const [generatedValue, setGeneratedValue] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrFileName, setQrFileName] = useState("");
  const [pendingDownloadFormat, setPendingDownloadFormat] = useState<
    "png" | "jpeg" | "svg" | null
  >(null);
  const [limitToastOpen, setLimitToastOpen] = useState(false);
  const [limitMinutes, setLimitMinutes] = useState(0);
  const [downloadLimitOpen, setDownloadLimitOpen] = useState(false);

  const draftValue = useMemo(() => {
    switch (activeType) {
      case "url":
        return url.trim();
      case "text":
        return text.trim();
      case "wifi": {
        if (!wifi.ssid.trim()) return "";
        const type = wifi.security === "nopass" ? "nopass" : wifi.security.toUpperCase();
        const parts = [
          `T:${type}`,
          `S:${escapeWifi(wifi.ssid.trim())}`,
          wifi.security !== "nopass" ? `P:${escapeWifi(wifi.password)}` : "",
          wifi.hidden ? "H:true" : "",
        ].filter(Boolean);
        return `WIFI:${parts.join(";")};`;
      }
      case "contact": {
        const entries: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
        const first = contact.firstName.trim();
        const last = contact.lastName.trim();
        if (first || last) {
          entries.push(`N:${escapeVCard(last)};${escapeVCard(first)};;;`);
          entries.push(`FN:${escapeVCard(`${first} ${last}`.trim())}`);
        }
        if (contact.phone.trim()) entries.push(`TEL:${escapeVCard(contact.phone.trim())}`);
        if (contact.email.trim()) entries.push(`EMAIL:${escapeVCard(contact.email.trim())}`);
        if (contact.company.trim()) entries.push(`ORG:${escapeVCard(contact.company.trim())}`);
        if (contact.title.trim()) entries.push(`TITLE:${escapeVCard(contact.title.trim())}`);
        if (contact.website.trim()) entries.push(`URL:${escapeVCard(contact.website.trim())}`);
        if (contact.address.trim()) entries.push(`ADR:${escapeVCard(contact.address.trim())}`);
        entries.push("END:VCARD");
        return entries.length > 3 ? entries.join("\n") : "";
      }
      case "email": {
        if (!email.address.trim()) return "";
        const query = new URLSearchParams();
        if (email.subject.trim()) query.set("subject", email.subject.trim());
        if (email.body.trim()) query.set("body", email.body.trim());
        const suffix = query.toString();
        return `mailto:${email.address.trim()}${suffix ? `?${suffix}` : ""}`;
      }
      case "phone":
        return phoneNumber.trim() ? `tel:${phoneNumber.trim()}` : "";
      case "sms":
        return sms.phone.trim() ? `SMSTO:${sms.phone.trim()}:${sms.message.trim()}` : "";
      case "location":
        return location.latitude.trim() && location.longitude.trim()
          ? `geo:${location.latitude.trim()},${location.longitude.trim()}`
          : "";
      case "event": {
        const start = formatIcsDate(event.start);
        const end = formatIcsDate(event.end);
        if (!event.title.trim() && !start && !end) return "";
        const lines = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          event.title.trim() ? `SUMMARY:${escapeVCard(event.title.trim())}` : "",
          event.location.trim() ? `LOCATION:${escapeVCard(event.location.trim())}` : "",
          start ? `DTSTART:${start}` : "",
          end ? `DTEND:${end}` : "",
          event.description.trim()
            ? `DESCRIPTION:${escapeVCard(event.description.trim())}`
            : "",
          "END:VEVENT",
          "END:VCALENDAR",
        ].filter(Boolean);
        return lines.join("\n");
      }
      case "crypto": {
        if (!crypto.address.trim()) return "";
        const param = crypto.amount.trim()
          ? `?${crypto.network === "bitcoin" ? "amount" : "value"}=${crypto.amount.trim()}`
          : "";
        return `${crypto.network}:${crypto.address.trim()}${param}`;
      }
      default:
        return "";
    }
  }, [
    activeType,
    url,
    text,
    wifi,
    contact,
    email,
    phoneNumber,
    sms,
    location,
    event,
    crypto,
  ]);

  useEffect(() => {
    if (!limitToastOpen) return;

    const timer = window.setTimeout(() => setLimitToastOpen(false), 4500);
    return () => window.clearTimeout(timer);
  }, [limitToastOpen]);

  useEffect(() => {
    if (!downloadLimitOpen) return;

    const timer = window.setTimeout(() => setDownloadLimitOpen(false), 4500);
    return () => window.clearTimeout(timer);
  }, [downloadLimitOpen]);

  useEffect(() => {
    setGeneratedValue("");
    setQrDataUrl("");
    setQrFileName("");
    setPendingDownloadFormat(null);
  }, [activeType]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setColors(colorsDraft);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [colorsDraft]);

  const readHistory = () => {
    if (typeof window === "undefined") return [] as number[];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      return Array.isArray(parsed) ? parsed.filter((value) => Number.isFinite(value)) : [];
    } catch {
      return [] as number[];
    }
  };

  const writeHistory = (history: number[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  };

  const hashValue = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  };

  const readDownloads = () => {
    if (typeof window === "undefined") return {} as Record<string, number>;
    try {
      const raw = window.localStorage.getItem(DOWNLOADS_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {} as Record<string, number>;
    }
  };

  const writeDownloads = (downloads: Record<string, number>) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  };

  const triggerDownload = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName || "qrcode";
    link.click();
  };

  const recordDownloadIfAllowed = (dataUrl: string, fileName: string) => {
    if (!generatedValue.trim()) return false;
    const key = hashValue(generatedValue);
    const downloads = readDownloads();
    const currentCount = downloads[key] ?? 0;

    if (currentCount >= MAX_DOWNLOADS_PER_QR) {
      setDownloadLimitOpen(true);
      return false;
    }

    triggerDownload(dataUrl, fileName);
    const nextDownloads = { ...downloads, [key]: currentCount + 1 };
    writeDownloads(nextDownloads);
    return true;
  };

  const handleGenerate = () => {
    if (!draftValue) return;

    const now = Date.now();
    const recent = readHistory().filter((timestamp) => now - timestamp < LIMIT_WINDOW_MS);

    if (recent.length >= MAX_GENERATIONS) {
      const oldest = Math.min(...recent);
      const remainingMs = Math.max(LIMIT_WINDOW_MS - (now - oldest), 0);
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
      setLimitMinutes(remainingMinutes);
      setLimitToastOpen(true);
      return;
    }

    const nextHistory = [...recent, now];
    writeHistory(nextHistory);
    setGeneratedValue(draftValue);
  };

  const handleDataUrlChange = (nextUrl: string, fileName: string) => {
    setQrDataUrl(nextUrl);
    setQrFileName(fileName);

    if (pendingDownloadFormat && nextUrl) {
      const didDownload = recordDownloadIfAllowed(nextUrl, fileName);
      if (didDownload) {
        setPendingDownloadFormat(null);
      }
    }
  };

  const handleDownload = (nextFormat: "png" | "jpeg" | "svg") => {
    if (!generatedValue.trim()) return;
    if (format !== nextFormat) {
      setPendingDownloadFormat(nextFormat);
      setFormat(nextFormat);
      return;
    }
    if (!qrDataUrl) return;
    recordDownloadIfAllowed(qrDataUrl, qrFileName);
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    try {
      await navigator.clipboard.writeText(qrDataUrl);
    } catch {
      // ignore
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
      },
      () => null
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0">
        <Squares
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          // borderColor="#271E37" OLD COLOR
          borderColor="#234728"
          hoverFillColor="#222222"
        />
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14">
        <section className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <span className="text-xl font-bold">CL</span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Coldlink
            </p>
          </div>
          <h1 className="max-w-3xl text-2xl! font-semibold leading-tight sm:text-5xl">
            Create QR codes in seconds.
          </h1>
          <p className="max-w-2xl text-base text-zinc-400 sm:text-lg">
            No expiration and no paywall.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge className="flex items-center gap-2 bg-emerald-500/15 text-emerald-200">
              <Tag className="h-3.5 w-3.5" />
              100% Free
            </Badge>
            <Badge className="flex items-center gap-2 bg-zinc-800 text-zinc-200">
              <User className="h-3.5 w-3.5" />
              No Signup
            </Badge>
            <Badge className="flex items-center gap-2 bg-blue-500/15 text-blue-200">
              <Zap className="h-3.5 w-3.5" />
              Instant Download
            </Badge>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-zinc-900/70 bg-zinc-900/40">
            <CardHeader>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Generate your QR code</h2>
                <p className="text-sm text-zinc-400">
                  Choose a type and fill in the details below.
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardContent className="space-y-6">
              <QrTypeTabs value={activeType} onChange={setActiveType} />
              <Divider />

              {activeType === "url" ? <UrlForm value={url} onChange={setUrl} /> : null}
              {activeType === "text" ? <TextForm value={text} onChange={setText} /> : null}
              {activeType === "wifi" ? (
                <WifiForm
                  ssid={wifi.ssid}
                  security={wifi.security}
                  password={wifi.password}
                  hidden={wifi.hidden}
                  onSsidChange={(value) => setWifi((prev) => ({ ...prev, ssid: value }))}
                  onSecurityChange={(value) => setWifi((prev) => ({ ...prev, security: value }))}
                  onPasswordChange={(value) => setWifi((prev) => ({ ...prev, password: value }))}
                  onHiddenChange={(value) => setWifi((prev) => ({ ...prev, hidden: value }))}
                />
              ) : null}
              {activeType === "contact" ? (
                <ContactForm
                  firstName={contact.firstName}
                  lastName={contact.lastName}
                  phone={contact.phone}
                  email={contact.email}
                  company={contact.company}
                  title={contact.title}
                  website={contact.website}
                  address={contact.address}
                  showAdditional={showContactExtras}
                  onChange={(field, value) => {
                    switch (field) {
                      case "firstName":
                        setContact((prev) => ({ ...prev, firstName: value }));
                        break;
                      case "lastName":
                        setContact((prev) => ({ ...prev, lastName: value }));
                        break;
                      case "phone":
                        setContact((prev) => ({ ...prev, phone: value }));
                        break;
                      case "email":
                        setContact((prev) => ({ ...prev, email: value }));
                        break;
                      case "company":
                        setContact((prev) => ({ ...prev, company: value }));
                        break;
                      case "title":
                        setContact((prev) => ({ ...prev, title: value }));
                        break;
                      case "website":
                        setContact((prev) => ({ ...prev, website: value }));
                        break;
                      case "address":
                        setContact((prev) => ({ ...prev, address: value }));
                        break;
                      default:
                        break;
                    }
                  }}
                  onToggleAdditional={() => setShowContactExtras((prev) => !prev)}
                />
              ) : null}
              {activeType === "email" ? (
                <EmailForm
                  address={email.address}
                  subject={email.subject}
                  body={email.body}
                  onChange={(field, value) => {
                    setEmail((prev) => ({ ...prev, [field]: value }));
                  }}
                />
              ) : null}
              {activeType === "phone" ? (
                <PhoneForm phone={phoneNumber} onChange={setPhoneNumber} />
              ) : null}
              {activeType === "sms" ? (
                <SmsForm
                  phone={sms.phone}
                  message={sms.message}
                  onChange={(field, value) => {
                    setSms((prev) => ({ ...prev, [field]: value }));
                  }}
                />
              ) : null}
              {activeType === "location" ? (
                <LocationForm
                  latitude={location.latitude}
                  longitude={location.longitude}
                  onChange={(field, value) => {
                    setLocation((prev) => ({ ...prev, [field]: value }));
                  }}
                  onUseCurrent={handleUseCurrentLocation}
                />
              ) : null}
              {activeType === "event" ? (
                <EventForm
                  title={event.title}
                  location={event.location}
                  start={event.start}
                  end={event.end}
                  description={event.description}
                  onChange={(field, value) => {
                    setEvent((prev) => ({ ...prev, [field]: value }));
                  }}
                />
              ) : null}
              {activeType === "crypto" ? (
                <CryptoForm
                  network={crypto.network}
                  address={crypto.address}
                  amount={crypto.amount}
                  onNetworkChange={(value) =>
                    setCrypto((prev) => ({ ...prev, network: value }))
                  }
                  onChange={(field, value) => {
                    setCrypto((prev) => ({ ...prev, [field]: value }));
                  }}
                />
              ) : null}

              <Divider />

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" disabled={!draftValue} onClick={handleGenerate}>
                  Generate
                </Button>
                {generatedValue ? (
                  <div className="animate-pulse rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-xs font-medium text-emerald-200">
                    Ready to download
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <QrCodePreview
              value={generatedValue}
              size={resolution}
              format={format}
              foregroundColor={colors.foreground}
              backgroundColor={colors.background}
              onDataUrlChange={handleDataUrlChange}
            />
            <CustomizeAppearance
              foreground={colorsDraft.foreground}
              background={colorsDraft.background}
              onForegroundChange={(value) =>
                setColorsDraft((prev) => ({ ...prev, foreground: value }))
              }
              onBackgroundChange={(value) =>
                setColorsDraft((prev) => ({ ...prev, background: value }))
              }
              onReset={() => {
                const next = { foreground: "#111111", background: "#ffffff" };
                setColorsDraft(next);
                setColors(next);
              }}
            />
            <DownloadOptions
              resolution={resolution}
              onResolutionChange={setResolution}
              activeFormat={format}
              onDownload={handleDownload}
              onCopy={handleCopy}
              isReady={Boolean(qrDataUrl)}
            />
          </div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-zinc-900/60 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Coldlink
      </footer>
      {limitToastOpen ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-20 w-full max-w-sm">
          <Toast className="pointer-events-auto border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <ToastTitle className="text-sm font-semibold">Rate limit reached</ToastTitle>
                <ToastDescription className="text-xs text-zinc-400">
                  You can generate up to {MAX_GENERATIONS} QR codes per hour. Try again in about
                  {" "}{limitMinutes} minute{limitMinutes === 1 ? "" : "s"}.
                </ToastDescription>
              </div>
              <ToastAction className="text-xs" onClick={() => setLimitToastOpen(false)}>
                Dismiss
              </ToastAction>
            </div>
          </Toast>
        </div>
      ) : null}
      {downloadLimitOpen ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-20 w-full max-w-sm">
          <Toast className="pointer-events-auto border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <ToastTitle className="text-sm font-semibold">Download limit reached</ToastTitle>
                <ToastDescription className="text-xs text-zinc-400">
                  Each QR code can be downloaded up to {MAX_DOWNLOADS_PER_QR} times. Generate a
                  new QR code to download more.
                </ToastDescription>
              </div>
              <ToastAction className="text-xs" onClick={() => setDownloadLimitOpen(false)}>
                Dismiss
              </ToastAction>
            </div>
          </Toast>
        </div>
      ) : null}
    </div>
  );
}
