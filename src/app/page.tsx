"use client";

import jsQR from "jsqr";
import JSZip from "jszip";
import Link from "next/link";
import Papa from "papaparse";
import QRCode from "qrcode";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type QrMode = "text" | "wifi" | "vcard";
type WifiEncryption = "WPA" | "WEP" | "nopass";

type WifiForm = {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
};

type VcardForm = {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
};

type HistoryItem = {
  id: string;
  mode: QrMode;
  label: string;
  payload: string;
  content: string;
  wifi: WifiForm;
  vcard: VcardForm;
  createdAt: string;
};

const HISTORY_KEY = "qr-tool-history-v1";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = src;
  });
}

function toSafeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "qr";
}

function dataUrlLabel(mode: QrMode, content: string, wifi: WifiForm, vcard: VcardForm) {
  if (mode === "wifi") return `WiFi - ${wifi.ssid || "network"}`;
  if (mode === "vcard") {
    const name = `${vcard.firstName} ${vcard.lastName}`.trim();
    return `vCard - ${name || "contact"}`;
  }
  return content.slice(0, 50) || "Text QR";
}

export default function Home() {
  const [mode, setMode] = useState<QrMode>("text");
  const [content, setContent] = useState("https://www.wikipedia.org");
  const [wifi, setWifi] = useState<WifiForm>({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [vcard, setVcard] = useState<VcardForm>({
    firstName: "",
    lastName: "",
    company: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  });

  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>("M");
  const [foregroundColor, setForegroundColor] = useState("#101828");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(20);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [batchMessage, setBatchMessage] = useState("");
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  const hasLogo = Boolean(logoDataUrl);
  const effectiveErrorCorrectionLevel: ErrorCorrectionLevel = hasLogo ? "H" : errorCorrectionLevel;
  const effectiveMargin = hasLogo ? Math.max(margin, 2) : margin;
  const effectiveLogoScale = hasLogo ? Math.min(logoScale, 22) : logoScale;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as HistoryItem[];
      if (Array.isArray(parsed)) {
        setRecentHistory(parsed.slice(0, 8));
      }
    } catch {
      // ignore malformed local history
    }
  }, []);

  const qrPayload = useMemo(() => {
    if (mode === "wifi") {
      if (!wifi.ssid.trim()) return "";
      const escapedSsid = wifi.ssid.replace(/([\\;,:\"])/g, "\\$1");
      const escapedPassword = wifi.password.replace(/([\\;,:\"])/g, "\\$1");
      const hiddenFlag = wifi.hidden ? "true" : "false";
      return `WIFI:T:${wifi.encryption};S:${escapedSsid};P:${escapedPassword};H:${hiddenFlag};;`;
    }

    if (mode === "vcard") {
      const fullName = `${vcard.firstName} ${vcard.lastName}`.trim();
      if (!fullName) return "";

      const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${vcard.lastName};${vcard.firstName}`, `FN:${fullName}`];
      if (vcard.company.trim()) lines.push(`ORG:${vcard.company.trim()}`);
      if (vcard.title.trim()) lines.push(`TITLE:${vcard.title.trim()}`);
      if (vcard.phone.trim()) lines.push(`TEL:${vcard.phone.trim()}`);
      if (vcard.email.trim()) lines.push(`EMAIL:${vcard.email.trim()}`);
      if (vcard.website.trim()) lines.push(`URL:${vcard.website.trim()}`);
      if (vcard.address.trim()) lines.push(`ADR:;;${vcard.address.trim()}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    return content;
  }, [mode, content, wifi, vcard]);

  const qrOptions = useMemo(
    () => ({
      width: size,
      margin: effectiveMargin,
      errorCorrectionLevel: effectiveErrorCorrectionLevel,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    }),
    [size, effectiveMargin, effectiveErrorCorrectionLevel, foregroundColor, backgroundColor],
  );

  useEffect(() => {
    let cancelled = false;

    async function generateQr() {
      if (!qrPayload.trim()) {
        setErrorMessage("Add text or complete required fields to generate your QR code.");
        setQrDataUrl("");
        setQrSvg("");
        return;
      }

      try {
        const [pngUrl, svgMarkup] = await Promise.all([
          QRCode.toDataURL(qrPayload, qrOptions),
          QRCode.toString(qrPayload, { ...qrOptions, type: "svg" }),
        ]);

        if (!cancelled) {
          setQrDataUrl(pngUrl);
          setQrSvg(svgMarkup);
          setErrorMessage("");
        }
      } catch {
        if (!cancelled) {
          setErrorMessage("Could not generate QR code. Try shorter content or simpler colors.");
        }
      }
    }

    generateQr();
    return () => {
      cancelled = true;
    };
  }, [qrPayload, qrOptions]);

  function saveHistory(nextItems: HistoryItem[]) {
    setRecentHistory(nextItems);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextItems));
  }

  function saveCurrentToHistory() {
    if (!qrPayload.trim()) return;
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      mode,
      label: dataUrlLabel(mode, content, wifi, vcard),
      payload: qrPayload,
      content,
      wifi,
      vcard,
      createdAt: new Date().toISOString(),
    };
    const deduped = [item, ...recentHistory.filter((entry) => entry.payload !== item.payload)].slice(0, 8);
    saveHistory(deduped);
    setActionMessage("Saved to recent history.");
  }

  function restoreFromHistory(item: HistoryItem) {
    setMode(item.mode);
    setContent(item.content);
    setWifi(item.wifi);
    setVcard(item.vcard);
    setActionMessage(`Loaded: ${item.label}`);
  }

  function clearHistory() {
    saveHistory([]);
    setActionMessage("History cleared.");
  }

  async function handleDownloadPng() {
    if (!qrDataUrl) return;

    if (!logoDataUrl) {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = "qr-code.png";
      link.click();
      return;
    }

    try {
      const [qrImage, logoImage] = await Promise.all([loadImage(qrDataUrl), loadImage(logoDataUrl)]);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(qrImage, 0, 0, size, size);
      const logoSize = Math.max(36, Math.floor((size * effectiveLogoScale) / 100));
      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;

      context.fillStyle = "#ffffff";
      context.beginPath();
      context.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 12);
      context.fill();
      context.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

      const mergedPng = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = mergedPng;
      link.download = "qr-code.png";
      link.click();
    } catch {
      setErrorMessage("Logo rendering failed. Try a different logo image.");
    }
  }

  function handleDownloadSvg() {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyPayload() {
    if (!qrPayload.trim()) return;
    await navigator.clipboard.writeText(qrPayload);
    setActionMessage("QR content copied to clipboard.");
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({
        title: "QR Code Generator",
        text: "Create your own QR code instantly.",
        url,
      });
      setActionMessage("Shared successfully.");
      return;
    }
    await navigator.clipboard.writeText(url);
    setActionMessage("Share URL copied to clipboard.");
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleScanUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("Invalid image data"));
        };
        reader.onerror = () => reject(new Error("Unable to read image"));
        reader.readAsDataURL(file);
      });

      const image = await loadImage(fileDataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setScanMessage("Could not initialize image scanner.");
        return;
      }

      context.drawImage(image, 0, 0, image.width, image.height);
      const imageData = context.getImageData(0, 0, image.width, image.height);
      const decoded = jsQR(imageData.data, imageData.width, imageData.height);
      if (!decoded?.data) {
        setScanMessage("No QR code was detected in that image.");
        return;
      }

      setMode("text");
      setContent(decoded.data);
      setScanMessage("QR scanned successfully. Content loaded into URL/Text mode.");
      setErrorMessage("");
    } catch {
      setScanMessage("Scan failed. Try a clearer image with higher contrast.");
    }
  }

  async function handleBatchCsvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBatchMessage("Reading CSV and generating QR files...");
    const csvText = await file.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    const rows = parsed.data;

    if (!rows.length) {
      setBatchMessage("CSV appears empty.");
      return;
    }

    const startIndex = rows[0]?.[0]?.toLowerCase().includes("content") ? 1 : 0;
    const values = rows.slice(startIndex).map((row) => row[0]?.trim()).filter(Boolean) as string[];

    if (!values.length) {
      setBatchMessage("No valid values found in first column.");
      return;
    }

    try {
      const zip = new JSZip();
      const batchOptions = {
        ...qrOptions,
        errorCorrectionLevel: "M" as ErrorCorrectionLevel,
      };

      for (let index = 0; index < values.length; index += 1) {
        const value = values[index];
        const dataUrl = await QRCode.toDataURL(value, batchOptions);
        const fileBlob = await fetch(dataUrl).then((res) => res.blob());
        const base = toSafeFilename(value);
        zip.file(`${String(index + 1).padStart(2, "0")}-${base}.png`, fileBlob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "qr-batch.zip";
      link.click();
      URL.revokeObjectURL(link.href);
      setBatchMessage(`Batch export complete: ${values.length} QR files.`);
    } catch {
      setBatchMessage("Batch generation failed. Check CSV format and try again.");
    }
  }

  function applyTemplate(template: "website" | "wifi" | "business" | "menu" | "event") {
    if (template === "website") {
      setMode("text");
      setContent("https://www.github.com");
      return;
    }
    if (template === "wifi") {
      setMode("wifi");
      setWifi({ ssid: "Cafe_WiFi", password: "Pass@12345", encryption: "WPA", hidden: false });
      return;
    }
    if (template === "business") {
      setMode("vcard");
      setVcard({
        firstName: "Alex",
        lastName: "Khan",
        company: "Acme Tech",
        title: "Product Manager",
        phone: "+92 300 1234567",
        email: "alex@acmetech.com",
        website: "https://acmetech.com",
        address: "Karachi, Pakistan",
      });
      return;
    }
    if (template === "menu") {
      setMode("text");
      setContent("https://restaurant.example/menu");
      return;
    }
    setMode("text");
    setContent("Event: Dev Meetup 2026\nDate: 10 Apr 2026\nVenue: Hall A\nPass: VIP-009");
  }

  return (
    <div className="w-full py-6 sm:py-8">
      <section className="rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/55">Daily Utility Tool</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">QR Code Generator</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black/70 sm:text-base">
          Generate QR codes for links, WiFi credentials, contact cards, and plain text instantly. Customize
          colors, error correction level, size, margin, templates, and logo overlay. Export PNG/SVG or batch
          generate from CSV.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold">Templates</h2>
        <div className="mt-3 grid gap-2 grid-cols-2 md:grid-cols-5">
          <button type="button" onClick={() => applyTemplate("website")} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5">Website</button>
          <button type="button" onClick={() => applyTemplate("wifi")} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5">WiFi Card</button>
          <button type="button" onClick={() => applyTemplate("business")} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5">Business Card</button>
          <button type="button" onClick={() => applyTemplate("menu")} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5">Menu Link</button>
          <button type="button" onClick={() => applyTemplate("event")} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5">Event Pass</button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold">Preset mode</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setMode("text")} className={`h-10 rounded-lg border text-sm font-medium ${mode === "text" ? "border-black bg-black text-white" : "border-black/20 bg-white"}`}>URL / Text</button>
                <button type="button" onClick={() => setMode("wifi")} className={`h-10 rounded-lg border text-sm font-medium ${mode === "wifi" ? "border-black bg-black text-white" : "border-black/20 bg-white"}`}>WiFi</button>
                <button type="button" onClick={() => setMode("vcard")} className={`h-10 rounded-lg border text-sm font-medium ${mode === "vcard" ? "border-black bg-black text-white" : "border-black/20 bg-white"}`}>vCard</button>
              </div>
            </div>

            {mode === "text" ? (
              <div>
                <label className="text-sm font-semibold" htmlFor="content">URL or Text</label>
                <textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-black/15 bg-[#fffdfa] p-3 text-sm outline-none transition focus:border-black/35" placeholder="https://your-site.com/page" />
              </div>
            ) : null}

            {mode === "wifi" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold sm:col-span-2">Network name (SSID)
                  <input value={wifi.ssid} onChange={(event) => setWifi((prev) => ({ ...prev, ssid: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" placeholder="Office_WiFi" />
                </label>
                <label className="text-sm font-semibold">Security
                  <select value={wifi.encryption} onChange={(event) => setWifi((prev) => ({ ...prev, encryption: event.target.value as WifiEncryption }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No password</option>
                  </select>
                </label>
                <label className="text-sm font-semibold">Password
                  <input value={wifi.password} onChange={(event) => setWifi((prev) => ({ ...prev, password: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" placeholder="********" disabled={wifi.encryption === "nopass"} />
                </label>
                <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2"><input type="checkbox" checked={wifi.hidden} onChange={(event) => setWifi((prev) => ({ ...prev, hidden: event.target.checked }))} />Hidden network</label>
              </div>
            ) : null}

            {mode === "vcard" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold">First name<input value={vcard.firstName} onChange={(event) => setVcard((prev) => ({ ...prev, firstName: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" /></label>
                <label className="text-sm font-semibold">Last name<input value={vcard.lastName} onChange={(event) => setVcard((prev) => ({ ...prev, lastName: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" /></label>
                <label className="text-sm font-semibold">Company<input value={vcard.company} onChange={(event) => setVcard((prev) => ({ ...prev, company: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" /></label>
                <label className="text-sm font-semibold">Job title<input value={vcard.title} onChange={(event) => setVcard((prev) => ({ ...prev, title: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" /></label>
                <label className="text-sm font-semibold">Phone<input value={vcard.phone} onChange={(event) => setVcard((prev) => ({ ...prev, phone: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" placeholder="+1 555 123 4567" /></label>
                <label className="text-sm font-semibold">Email<input value={vcard.email} onChange={(event) => setVcard((prev) => ({ ...prev, email: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" placeholder="name@company.com" /></label>
                <label className="text-sm font-semibold sm:col-span-2">Website<input value={vcard.website} onChange={(event) => setVcard((prev) => ({ ...prev, website: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" placeholder="https://company.com" /></label>
                <label className="text-sm font-semibold sm:col-span-2">Address<input value={vcard.address} onChange={(event) => setVcard((prev) => ({ ...prev, address: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none" /></label>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Size ({size}px)
                <input type="range" min={180} max={1100} value={size} onChange={(event) => setSize(Number(event.target.value))} className="mt-2 w-full" />
              </label>
              <label className="text-sm font-semibold">Margin ({margin})
                <input type="range" min={0} max={8} value={margin} onChange={(event) => setMargin(Number(event.target.value))} className="mt-2 w-full" />
              </label>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <p className="text-sm font-semibold">Print presets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => setSize(256)} className="rounded-full border border-black/15 px-3 py-1.5 text-xs hover:bg-black/5">Sticker 256px</button>
                <button type="button" onClick={() => setSize(512)} className="rounded-full border border-black/15 px-3 py-1.5 text-xs hover:bg-black/5">Print 512px</button>
                <button type="button" onClick={() => setSize(1024)} className="rounded-full border border-black/15 px-3 py-1.5 text-xs hover:bg-black/5">A4 1024px</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold">Foreground<input type="color" value={foregroundColor} onChange={(event) => setForegroundColor(event.target.value)} className="mt-2 block h-11 w-full cursor-pointer rounded-md border border-black/20 bg-transparent" /></label>
              <label className="text-sm font-semibold">Background<input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} className="mt-2 block h-11 w-full cursor-pointer rounded-md border border-black/20 bg-transparent" /></label>
              <label className="text-sm font-semibold">Error correction
                <select value={errorCorrectionLevel} onChange={(event) => setErrorCorrectionLevel(event.target.value as ErrorCorrectionLevel)} className="mt-2 h-11 w-full rounded-md border border-black/20 bg-white px-3 text-sm outline-none">
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <p className="text-sm font-semibold">Logo (optional)</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="text-sm font-medium">Upload logo image
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} className="mt-2 block w-full rounded-md border border-black/20 px-2 py-2 text-xs" />
                </label>
                {logoDataUrl ? <button type="button" onClick={() => setLogoDataUrl(null)} className="h-10 rounded-full border border-black/20 px-4 text-sm font-medium hover:bg-black/5">Remove logo</button> : null}
              </div>
              {logoDataUrl ? (
                <label className="mt-4 block text-sm font-semibold">Logo size ({logoScale}%)
                  <input type="range" min={12} max={22} value={logoScale} onChange={(event) => setLogoScale(Number(event.target.value))} className="mt-2 w-full" />
                </label>
              ) : null}
              {logoDataUrl ? <p className="mt-2 text-xs text-black/65">Logo mode is active: scan-safe settings are enforced (Error correction H + minimum margin 2).</p> : null}
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <p className="text-sm font-semibold">Scan from image</p>
              <label className="mt-2 block text-sm font-medium">Upload PNG/JPG/WebP containing a QR code
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleScanUpload} className="mt-2 block w-full rounded-md border border-black/20 px-2 py-2 text-xs" />
              </label>
              {scanMessage ? <p className="mt-2 text-xs text-black/65">{scanMessage}</p> : null}
              <p className="mt-2 text-xs text-black/60">Privacy: uploaded images are processed in your browser for decoding.</p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <p className="text-sm font-semibold">Batch QR from CSV</p>
              <label className="mt-2 block text-sm font-medium">Upload CSV (first column = content)
                <input type="file" accept=".csv,text/csv" onChange={handleBatchCsvUpload} className="mt-2 block w-full rounded-md border border-black/20 px-2 py-2 text-xs" />
              </label>
              {batchMessage ? <p className="mt-2 text-xs text-black/65">{batchMessage}</p> : null}
            </div>

            {errorMessage ? <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p> : null}
            {actionMessage ? <p className="rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">{actionMessage}</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold">Preview & actions</h2>
          <div className="mt-4 rounded-2xl border border-black/10 bg-[#f6f8ff] p-4">
            {qrDataUrl ? (
              <div className="relative mx-auto aspect-square w-full" style={{ maxWidth: Math.min(size, 320) }}>
                <img src={qrDataUrl} alt="Generated QR code" className="h-full w-full rounded-xl border border-black/10 bg-white object-contain p-2" />
                {logoDataUrl ? (
                  <img src={logoDataUrl} alt="Logo overlay" className="absolute left-1/2 top-1/2 rounded-md border border-black/10 bg-white p-1" style={{ width: `${effectiveLogoScale}%`, height: `${effectiveLogoScale}%`, transform: "translate(-50%, -50%)" }} />
                ) : null}
              </div>
            ) : (
              <div className="grid h-80 place-items-center rounded-xl border border-dashed border-black/20 bg-white text-sm text-black/55">Your QR preview appears here.</div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleDownloadPng} className="h-11 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:translate-y-[-1px]">Download PNG</button>
            <button type="button" onClick={handleDownloadSvg} className="h-11 rounded-full border border-black/20 px-5 text-sm font-semibold transition hover:bg-black/5">Download SVG</button>
            <button type="button" onClick={handleCopyPayload} className="h-11 rounded-full border border-black/20 px-5 text-sm font-semibold transition hover:bg-black/5">Copy Content</button>
            <button type="button" onClick={handleShare} className="h-11 rounded-full border border-black/20 px-5 text-sm font-semibold transition hover:bg-black/5">Share Tool</button>
            <button type="button" onClick={saveCurrentToHistory} className="h-11 rounded-full border border-black/20 px-5 text-sm font-semibold transition hover:bg-black/5 sm:col-span-2">Save to Recent History</button>
          </div>

          <p className="mt-4 text-xs leading-6 text-black/60">
            {hasLogo ? "Logo mode is using scan-safe settings (H error correction + minimum margin)." : "Tip: if you add a center logo, switch to H error correction for better scan reliability."}
          </p>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Recent history</h3>
              {recentHistory.length ? (
                <button type="button" onClick={clearHistory} className="text-xs text-black/60 underline hover:text-black">Clear</button>
              ) : null}
            </div>
            <div className="mt-3 space-y-2">
              {recentHistory.length ? recentHistory.map((item) => (
                <button key={item.id} type="button" onClick={() => restoreFromHistory(item)} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-left text-xs hover:bg-black/5">
                  <p className="font-semibold text-black/80">{item.label}</p>
                  <p className="mt-1 text-black/60">{new Date(item.createdAt).toLocaleString()}</p>
                </button>
              )) : <p className="text-xs text-black/60">No recent QR items saved yet.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold">How to use</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-black/75 sm:text-base">
          <li>Select URL/Text, WiFi, or vCard preset mode.</li>
          <li>Use templates for business card, menu, WiFi, or event pass layouts.</li>
          <li>Customize size, print preset, colors, margin, and error correction.</li>
          <li>Optionally add a center logo, then download PNG or SVG.</li>
          <li>Use scan-from-image and batch CSV generation for high-volume workflows.</li>
        </ol>
      </section>

      <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold">Ad & Policy Readiness</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-black/75 sm:text-base">
          <li>Core QR generation and scanning features are available without registration.</li>
          <li>Privacy Policy, Terms, About, and Contact pages are published site-wide.</li>
          <li>Uploads are processed in-browser for scanning, reducing unnecessary data sharing.</li>
          <li>Advertising is used to support free access while keeping the product usable.</li>
          <li>Support requests can be sent to support.webservice@gmail.com.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Popular QR Guides</h2>
          <Link href="/guides" className="text-sm font-medium underline-offset-4 hover:underline">
            View all guides
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/guides/qr-code-for-whatsapp-link" className="rounded-xl border border-black/10 bg-[#fbfcff] p-4 text-sm font-medium leading-6 hover:bg-black/5">
            QR code for WhatsApp link
          </Link>
          <Link href="/guides/qr-code-for-wifi-password" className="rounded-xl border border-black/10 bg-[#fbfcff] p-4 text-sm font-medium leading-6 hover:bg-black/5">
            QR code for WiFi password
          </Link>
          <Link href="/guides/qr-code-for-restaurant-menu" className="rounded-xl border border-black/10 bg-[#fbfcff] p-4 text-sm font-medium leading-6 hover:bg-black/5">
            QR code for restaurant menu
          </Link>
          <Link href="/guides/why-qr-code-is-not-scanning" className="rounded-xl border border-black/10 bg-[#fbfcff] p-4 text-sm font-medium leading-6 hover:bg-black/5">
            Why QR code is not scanning
          </Link>
          <Link href="/guides/qr-code-with-logo-best-practices" className="rounded-xl border border-black/10 bg-[#fbfcff] p-4 text-sm font-medium leading-6 hover:bg-black/5 sm:col-span-2 lg:col-span-1">
            QR code with logo best practices
          </Link>
        </div>
      </section>
    </div>
  );
}
