export type Guide = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  steps: string[];
  tips: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const qrGuides: Guide[] = [
  {
    slug: "qr-code-for-whatsapp-link",
    title: "How To Create A QR Code For WhatsApp Link",
    description:
      "Generate a scannable QR code for your WhatsApp chat link, ideal for business cards, shops, and social media.",
    intro:
      "A WhatsApp QR code lets users open chat with one scan, without manually typing your number. It works great for store counters, packaging, posters, and Instagram bio links.",
    steps: [
      "Open the QR generator and keep mode on URL / Text.",
      "Paste your WhatsApp URL in this format: https://wa.me/923001234567.",
      "Pick colors with good contrast and keep margin at 2 or more.",
      "Generate preview and test by scanning from another phone.",
      "Download PNG for social posts or SVG for print designs.",
    ],
    tips: [
      "Use international format for phone number without spaces or plus sign in wa.me URL.",
      "Avoid low-contrast color combinations such as light gray on white.",
      "For posters, print at higher resolution and test from distance.",
    ],
    faqs: [
      {
        question: "Can I add a prefilled message in WhatsApp QR code?",
        answer:
          "Yes. Use a URL like https://wa.me/923001234567?text=Hello%20I%20want%20details and then generate the QR.",
      },
      {
        question: "Will this work on both Android and iPhone?",
        answer: "Yes, WhatsApp deep links work on both platforms when WhatsApp is installed.",
      },
    ],
  },
  {
    slug: "qr-code-for-wifi-password",
    title: "How To Create A QR Code For WiFi Password",
    description:
      "Create a WiFi QR code so guests can join your network quickly without typing SSID and password manually.",
    intro:
      "WiFi QR codes are perfect for cafes, offices, events, and homes. Guests scan once and connect instantly, reducing password mistakes and setup time.",
    steps: [
      "Switch preset mode to WiFi.",
      "Enter SSID, security type, and password.",
      "Enable hidden network option only if your router SSID is hidden.",
      "Generate and scan test before sharing with guests.",
      "Print and place at reception desk, wall, or table stand.",
    ],
    tips: [
      "Do not share admin router credentials in QR codes.",
      "Update QR code whenever WiFi password is changed.",
      "Use WPA/WPA2 for stronger network security.",
    ],
    faqs: [
      {
        question: "Is a WiFi QR code secure?",
        answer:
          "It is as secure as your WiFi password policy. Use strong passwords and rotate them periodically.",
      },
      {
        question: "Can old phones scan WiFi QR codes?",
        answer:
          "Most modern phones support it natively. Older devices may require a scanner app.",
      },
    ],
  },
  {
    slug: "qr-code-for-restaurant-menu",
    title: "How To Create A QR Code For Restaurant Menu",
    description:
      "Make a restaurant menu QR code for table cards, takeaway packaging, and storefront displays.",
    intro:
      "Menu QR codes help customers open your latest menu instantly and reduce reprint costs when prices or items change.",
    steps: [
      "Upload your menu online and copy the public URL.",
      "In URL / Text mode, paste the menu link.",
      "Use dark foreground with white background for reliable scanning.",
      "Generate code and print on table tents or stickers.",
      "Scan from multiple angles and lighting conditions before rollout.",
    ],
    tips: [
      "Use a mobile-friendly menu page for better customer experience.",
      "Keep printed QR size at least 2 x 2 cm for table cards.",
      "Add short text near the code like 'Scan to view menu'.",
    ],
    faqs: [
      {
        question: "Can I update menu without changing QR code?",
        answer:
          "Yes, if the page URL stays same. Update menu content on that page and existing QR will keep working.",
      },
      {
        question: "Should I use PNG or SVG for print?",
        answer: "Use SVG for professional print and PNG for quick social sharing.",
      },
    ],
  },
  {
    slug: "why-qr-code-is-not-scanning",
    title: "Why QR Code Is Not Scanning And How To Fix It",
    description:
      "Learn common reasons QR codes fail to scan and practical fixes for print, color, logo, and sizing issues.",
    intro:
      "If your QR does not scan, the issue is usually contrast, tiny size, over-styled design, or poor print quality. Use this checklist to fix it quickly.",
    steps: [
      "Increase contrast: dark code on light background.",
      "Raise error correction to H if logo is used.",
      "Increase code size and margin for print materials.",
      "Avoid reflective surfaces and blurry print outputs.",
      "Test using at least two different phones before publishing.",
    ],
    tips: [
      "Keep logo under roughly 20 to 22 percent of QR area.",
      "Do not crop quiet zone (empty border) around QR code.",
      "Prefer vector output (SVG/PDF) for large format print.",
    ],
    faqs: [
      {
        question: "Does gradient color break QR scanning?",
        answer:
          "Sometimes. Gradients can lower readability on some camera apps. Solid high-contrast colors are safer.",
      },
      {
        question: "Can social media compression break QR images?",
        answer:
          "Yes, heavy compression may blur modules. Upload higher quality PNG and test after publishing.",
      },
    ],
  },
  {
    slug: "qr-code-with-logo-best-practices",
    title: "QR Code With Logo Best Practices",
    description:
      "Add logos to QR codes without breaking scan reliability by following tested design and export rules.",
    intro:
      "Logo QR codes look more professional, but overdoing logo size or styling can break scans. Follow these proven best practices.",
    steps: [
      "Generate base QR with error correction level H.",
      "Upload a clear logo with transparent or clean background.",
      "Keep logo scale modest and centered.",
      "Maintain margin at 2 or higher.",
      "Test in bright and low light using multiple camera apps.",
    ],
    tips: [
      "Use square logos when possible for cleaner center placement.",
      "Avoid placing text or decorative elements over finder corners.",
      "Create separate versions for digital and print use cases.",
    ],
    faqs: [
      {
        question: "What is the safest logo size for scan success?",
        answer:
          "A practical range is around 15 to 22 percent of QR width, with H error correction enabled.",
      },
      {
        question: "Should logo QR use transparent background?",
        answer:
          "It can, but ensure the QR itself still has a clean light background and strong contrast.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return qrGuides.find((guide) => guide.slug === slug);
}
