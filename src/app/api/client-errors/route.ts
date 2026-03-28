import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.error("[client-error]", payload);
  } catch {
    // ignore malformed payload
  }

  return NextResponse.json({ ok: true });
}
