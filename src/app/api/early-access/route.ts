import { NextResponse } from "next/server";
import { AccessRequest, validateAccessRequest } from "@/lib/early-access";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Requests must come from this website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Expected a JSON request." },
      { status: 415 },
    );
  const text = await request.text();
  if (text.length > 10000)
    return NextResponse.json(
      { error: "Your request is too large." },
      { status: 413 },
    );
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("Invalid request");
  } catch {
    return NextResponse.json(
      { error: "Invalid request format." },
      { status: 400 },
    );
  }
  const keys = [
    "name",
    "email",
    "company",
    "employees",
    "provider",
    "message",
    "intent",
  ] as const;
  const values = Object.fromEntries(
    keys.map((key) => [
      key,
      typeof body[key] === "string" ? body[key].trim() : "",
    ]),
  ) as AccessRequest;
  const errors = validateAccessRequest(values);
  if (
    Object.keys(errors).length ||
    !["access", "demo", "contact"].includes(values.intent)
  )
    return NextResponse.json(
      { error: "Please check your form details.", errors },
      { status: 400 },
    );
  const webhook = process.env.EARLY_ACCESS_WEBHOOK_URL;
  if (!webhook)
    return NextResponse.json(
      {
        error:
          "Request collection is not connected. Nothing was sent or saved.",
      },
      { status: 503 },
    );
  try {
    const endpoint = new URL(webhook);
    if (endpoint.protocol !== "https:") throw new Error("HTTPS required");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.EARLY_ACCESS_WEBHOOK_TOKEN
          ? {
              Authorization: `Bearer ${process.env.EARLY_ACCESS_WEBHOOK_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify({
        ...values,
        source: "go-mail-website",
        requestedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Request service unavailable");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "We couldn’t confirm delivery. Please try again later." },
      { status: 502 },
    );
  }
}
