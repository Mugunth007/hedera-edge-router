import { NextRequest, NextResponse } from "next/server";

const AGENTS: Record<string, any> = {
  kai: {
    id: "agent-kai",
    subname: "kai",
    deviceAddress: process.env.HEDERA_ACCOUNT_ID || "0.0.11335112",
    agentAddress: "0x88527adfc6d3cf978d76d325cba5cdb67b2ed3f8",
    name: "Kai HederaEdge Agent",
    model: "llama-3.2",
  },
  default: {
    id: "agent-default",
    subname: "default",
    deviceAddress: process.env.HEDERA_ACCOUNT_ID || "0.0.11335112",
    agentAddress: "0x88527adfc6d3cf978d76d325cba5cdb67b2ed3f8",
    name: "Primary HederaEdge Agent",
    model: "llama-3.2",
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subname = searchParams.get("subname")?.toLowerCase() || "";

  const agent = AGENTS[subname] || {
    id: `agent-${subname}`,
    subname: subname,
    deviceAddress: process.env.HEDERA_ACCOUNT_ID || "0.0.11335112",
    agentAddress: "0x88527adfc6d3cf978d76d325cba5cdb67b2ed3f8",
    name: `${subname.toUpperCase()} HederaEdge Agent`,
    model: "llama-3.2",
  };

  return NextResponse.json(agent);
}
