import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address") || "";

  // Return active local edge agent on port 8000 by default, or NGROK_URL if configured
  const edgeUrl = process.env.EDGE_AGENT_URL || "http://127.0.0.1:8000";

  return NextResponse.json({
    address: address || "0.0.11335112",
    ngrokUrl: edgeUrl,
    status: "Active",
    uptime: "99.98%",
    lastSeen: new Date().toISOString(),
  });
}
