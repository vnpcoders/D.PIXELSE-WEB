import { NextResponse } from "next/server"
import { GOOGLE_SHEET_ENDPOINT } from "../../../config.js"

export async function POST(request) {
  if (!GOOGLE_SHEET_ENDPOINT || GOOGLE_SHEET_ENDPOINT.includes("PASTE_YOUR")) {
    return NextResponse.json(
      { ok: false, error: "Google Sheet endpoint not configured yet." },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const form = new URLSearchParams()
    form.append("name", body.name || "")
    form.append("email", body.email || "")
    form.append("phone", body.phone || "")
    form.append("message", body.message || "")
    form.append("timestamp", new Date().toISOString())

    // Server-to-server call — Apps Script's CORS quirks only affect
    // browser fetches, so this works cleanly here.
    await fetch(GOOGLE_SHEET_ENDPOINT, {
      method: "POST",
      body: form,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Failed to submit." }, { status: 500 })
  }
}
