import { getAdsensePublisherId } from "@/lib/runtime-config";
import { NextResponse } from "next/server";

const publisherId = getAdsensePublisherId();

export function GET() {
  if (!publisherId) {
    return new NextResponse(
      "# Set NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID or GOOGLE_ADSENSE_PUBLISHER_ID in production to serve ads.txt\n",
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      },
    );
  }

  return new NextResponse(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
