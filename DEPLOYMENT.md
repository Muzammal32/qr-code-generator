# Vercel Launch Checklist (AdSense Ready)

## 1) Connect And Deploy

1. Import repository into Vercel.
2. Set framework preset to Next.js (auto-detected).
3. Deploy to Production.

## 2) Configure Production Environment Variables

Set these in Vercel Project Settings -> Environment Variables (Production):

- NEXT_PUBLIC_SITE_URL = https://your-real-domain.com
- NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT = ca-pub-xxxxxxxxxxxxxxxx
- NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID = pub-xxxxxxxxxxxxxxxx
- NEXT_PUBLIC_GA4_ID = G-XXXXXXXXXX (optional)
- NEXT_PUBLIC_PLAUSIBLE_DOMAIN = your-real-domain.com (optional)

Redeploy after adding or changing variables.

## 3) Attach Custom Domain

1. Add your custom domain in Vercel.
2. Update DNS records as Vercel instructs.
3. Confirm HTTPS is active.

## 4) Post-Deploy Verification

Open these URLs on your live domain:

- /robots.txt
- /sitemap.xml
- /ads.txt
- /contact
- /privacy-policy
- /terms

Check page source of the home page and confirm:

- <meta name="google-adsense-account" content="ca-pub-...">

## 5) AdSense Submission Hygiene

1. Keep navigation and trust pages visible on all devices.
2. Ensure no broken links or empty sections.
3. Avoid aggressive ad placements before approval.
4. Keep useful, original, and task-focused content on key pages.

## 6) Quick Smoke Test (Mobile)

1. Generate QR from URL/Text mode.
2. Generate WiFi QR and scan using phone camera.
3. Generate vCard QR and verify contact import.
4. Export PNG and SVG.
5. Test with logo enabled and verify scan still works.

## 7) Common Failure Fixes

- ads.txt shows placeholder text:
  - Set NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID and redeploy.
- Missing AdSense meta tag:
  - Set NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT and redeploy.
- Wrong canonicals/sitemap URLs:
  - Set NEXT_PUBLIC_SITE_URL to exact production domain and redeploy.
