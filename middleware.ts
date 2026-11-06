import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface Agent {
  id: string
  subname: string
  deviceAddress: string
  agentAddress: string
}

interface Device {
  address: string
  ngrokUrl: string
  status: string
}

export async function middleware(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || ''
    const url = request.nextUrl
    
    // Ignore static files, internal database APIs, telemetry, dashboard, Next.js internal files
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/api/db') ||
      url.pathname.startsWith('/api/telemetry') ||
      url.pathname.startsWith('/api/payouts') ||
      url.pathname.startsWith('/api/x402') ||
      url.pathname.startsWith('/api/crosschain') ||
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/fonts') ||
      url.pathname.startsWith('/favicon.ico') ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|otf|ttf)$/)
    ) {
      return NextResponse.next()
    }

    // Check if we're on the main domain without subdomain
    if (
      hostname === 'hederaedge.xyz' ||
      hostname === 'www.hederaedge.xyz' ||
      hostname === 'localhost:3000' ||
      hostname === '127.0.0.1:3000' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    ) {
      return NextResponse.next()
    }

    // Extract subdomain
    let subdomain = ''
    if (hostname.includes('.hederaedge.xyz')) {
      subdomain = hostname.split('.hederaedge.xyz')[0]
    } else if (hostname.includes('.localhost')) {
      subdomain = hostname.split('.localhost')[0]
    } else {
      const parts = hostname.split(':')?.[0]?.split('.')
      if (parts && parts.length > 1) {
        subdomain = parts[0]
      }
    }
    
    if (!subdomain || subdomain === 'www') {
      return NextResponse.next()
    }

    console.log(`[HederaEdge Router] Processing request for subdomain: "${subdomain}" on path: ${url.pathname}`)

    const origin = url.origin

    // Fetch agent details from local/configured registry
    const agentResponse = await fetch(
      `${origin}/api/db/agents?subname=${encodeURIComponent(subdomain)}`
    )

    if (!agentResponse.ok) {
      console.error(`[HederaEdge Router] Failed to fetch agent: ${agentResponse.status}`)
      return new NextResponse('Agent lookup failed', { status: 500 })
    }

    const agent: Agent = await agentResponse.json()

    if (!agent || !agent.deviceAddress || !agent.agentAddress) {
      console.error(`[HederaEdge Router] No agent found with subname: ${subdomain}`)
      return new NextResponse('Agent not found', { status: 404 })
    }

    // Fetch device details
    const deviceResponse = await fetch(
      `${origin}/api/db/devices?address=${encodeURIComponent(agent.deviceAddress)}`
    )

    if (!deviceResponse.ok) {
      console.error(`[HederaEdge Router] Failed to fetch device: ${deviceResponse.status}`)
      return new NextResponse('Device lookup failed', { status: 500 })
    }

    const device: Device = await deviceResponse.json()

    if (!device || !device.ngrokUrl || device.status !== 'Active') {
      console.error(`[HederaEdge Router] Device inactive or missing for agent: ${subdomain}`)
      return new NextResponse('Device offline or inactive', { status: 503 })
    }

    // For GET requests on the root path, display the Interactive Aceternity Agent Chat Interface!
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HederaEdge Agent — ${subdomain.toUpperCase()}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #000000;
      color: #f8fafc;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-image: 
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(3, 143, 168, 0.15), transparent 70%),
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
      background-size: 100% 100%, 32px 32px, 32px 32px;
    }
    header {
      background: rgba(10, 10, 10, 0.7);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.9rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .agent-brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .agent-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #171717;
      border: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #ffffff;
      font-size: 1.15rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .agent-meta h1 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      letter-spacing: -0.01em;
    }
    .badge {
      font-size: 0.68rem;
      font-weight: 600;
      color: #e2e8f0;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.15rem 0.55rem;
      border-radius: 9999px;
      letter-spacing: 0.04em;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .badge-dot {
      width: 5px;
      height: 5px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 6px #10b981;
    }
    .agent-meta p {
      font-size: 0.72rem;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
      margin-top: 0.15rem;
    }
    .header-links {
      display: flex;
      gap: 0.6rem;
    }
    .header-links a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.03);
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      transition: all 0.2s;
    }
    .header-links a:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
      padding: 1.25rem 1rem;
      overflow: hidden;
    }
    #chat-stream {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .msg {
      max-width: 82%;
      padding: 1.1rem 1.35rem;
      border-radius: 18px;
      line-height: 1.6;
      font-size: 0.92rem;
      position: relative;
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, rgba(3, 143, 168, 0.9), rgba(18, 39, 92, 0.95));
      border: 1px solid rgba(3, 143, 168, 0.4);
      color: #ffffff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 20px rgba(3, 143, 168, 0.15);
    }
    .msg-agent {
      align-self: flex-start;
      background: rgba(18, 18, 18, 0.65);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom-left-radius: 4px;
      color: #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .proof-box {
      margin-top: 0.85rem;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.72rem;
      font-family: 'JetBrains Mono', monospace;
      color: #94a3b8;
    }
    .proof-box a {
      color: #ffffff;
      text-decoration: underline;
      font-weight: 600;
    }
    .proof-box a:hover {
      text-decoration: underline;
    }
    .chips {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 0;
      overflow-x: auto;
      margin-bottom: 0.5rem;
    }
    .chip {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      color: #cbd5e1;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .chip:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
    .input-bar {
      display: flex;
      gap: 0.6rem;
      padding-top: 0.5rem;
    }
    input {
      flex: 1;
      background: rgba(20, 20, 20, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 0.9rem 1.35rem;
      border-radius: 14px;
      color: #fff;
      font-size: 0.92rem;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: all 0.2s;
    }
    input:focus {
      border-color: rgba(255, 255, 255, 0.4);
      background: rgba(25, 25, 25, 0.9);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
    }
    button {
      background: #ffffff;
      color: #000000;
      border: none;
      padding: 0 1.75rem;
      border-radius: 14px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
      transition: transform 0.15s, opacity 0.2s;
    }
    button:hover {
      background: #e2e8f0;
      transform: scale(1.02);
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }
  </style>
</head>
<body>
  <header>
    <div class="agent-brand">
      <div class="agent-avatar">${subdomain.charAt(0).toUpperCase()}</div>
      <div class="agent-meta">
        <h1>
          ${subdomain.toUpperCase()}
          <span class="badge"><span class="badge-dot"></span> HEDERA EDGE NODE</span>
          <span class="badge" style="border-color: rgba(245, 158, 11, 0.4); color: #fbbf24; background: rgba(245, 158, 11, 0.1);">
            <span class="badge-dot" style="background: #fbbf24; box-shadow: 0 0 6px #fbbf24;"></span> x402 (0.05 HBAR)
          </span>
        </h1>
        <p>Host: ${device.address} | Model: Qwen 3 (1.7B Local) | HCS: 0.0.11335841</p>
      </div>
    </div>
    <div class="header-links">
      <a href="http://localhost:3000/dashboard" target="_blank">Live Telemetry</a>
      <a href="https://hashscan.io/testnet/topic/0.0.11335841" target="_blank">HashScan Topic ↗</a>
    </div>
  </header>

  <main>
    <div id="chat-stream">
      <div class="msg msg-agent">
        <strong>Hello! I am ${subdomain.toUpperCase()}.</strong><br />
        I am running on a decentralized edge device connected to the <strong>HederaEdge</strong> network. Every query you ask is processed on local neural weights and permanently signed to Hedera Consensus Service.
      </div>
    </div>

    <div class="chips">
      <div class="chip" onclick="sendSuggestion('What is HederaEdge?')">What is HederaEdge?</div>
      <div class="chip" onclick="sendSuggestion('How does on-chain AI consensus work?')">On-chain AI consensus?</div>
      <div class="chip" onclick="sendSuggestion('Why run AI on recycled mobile phones?')">Why use old phones?</div>
      <div class="chip" onclick="sendSuggestion('Explain Hedera Consensus Service')">Explain HCS</div>
    </div>

    <form class="input-bar" id="chat-form" onsubmit="handleSend(event)">
      <input type="text" id="user-input" placeholder="Ask this edge agent anything..." autocomplete="off" />
      <button type="submit" id="send-btn">Send</button>
    </form>
  </main>

  <script>
    const chatStream = document.getElementById('chat-stream');
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function appendUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'msg msg-user';
      msg.innerText = text;
      chatStream.appendChild(msg);
      chatStream.scrollTop = chatStream.scrollHeight;
    }

    function appendAgentMessage(text, proof, latencyMs, x402) {
      const msg = document.createElement('div');
      msg.className = 'msg msg-agent';

      let inner = '<div>' + escapeHtml(text).replace(/\\n/g, '<br/>') + '</div>';

      if (x402 || proof) {
        inner += \`
          <div class="proof-box">
            \${x402 ? \`
              <div style="margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #fbbf24;">
                ⚡ <strong>x402 Micropayment Settled:</strong> \${x402.amount || '0.05 HBAR'} on \${x402.network || 'hedera:testnet'}<br/>
                <span style="font-size: 0.68rem; color: #cbd5e1;">Tx ID: \${x402.transactionId}</span>
                <a href="\${x402.hashscanUrl}" target="_blank" rel="noreferrer" style="color: #fbbf24; margin-left: 6px;">HashScan ↗</a>
              </div>
            \` : ''}
            \${proof ? \`
              <div>⚡ <strong>Latency:</strong> \${latencyMs || 0} ms | <strong>Proof:</strong> \${proof.status || 'SUCCESS'}</div>
              <div style="margin-top: 4px;">
                <strong>HCS Topic:</strong> \${proof.topicId} |
                <a href="\${proof.hashscanUrl}" target="_blank" rel="noreferrer">HashScan Topic ↗</a>
              </div>
            \` : ''}
          </div>
        \`;
      }

      msg.innerHTML = inner;
      chatStream.appendChild(msg);
      chatStream.scrollTop = chatStream.scrollHeight;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function sendSuggestion(text) {
      input.value = text;
      handleSend(new Event('submit'));
    }

    async function handleSend(e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      sendBtn.disabled = true;
      sendBtn.innerText = 'Inferring...';

      appendUserMessage(text);

      const placeholder = document.createElement('div');
      placeholder.className = 'msg msg-agent';
      placeholder.innerText = '⚡ Edge node computing on-device response...';
      chatStream.appendChild(placeholder);
      chatStream.scrollTop = chatStream.scrollHeight;

      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        chatStream.removeChild(placeholder);

        if (data && data.reply) {
          appendAgentMessage(data.reply, data.telemetry?.onChainConfirmation, data.latencyMs, data.x402Settlement);
        } else {
          appendAgentMessage('Error: Received invalid response from agent node.', null, 0);
        }
      } catch (err) {
        chatStream.removeChild(placeholder);
        appendAgentMessage('Network Error: Failed to reach edge agent router (' + err.message + ')', null, 0);
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerText = 'Send';
        input.focus();
      }
    }
  </script>
</body>
</html>`,
        {
          headers: {
            'content-type': 'text/html; charset=utf-8',
          },
        }
      )
    }

    // For POST and other requests, forward to the device's URL
    const targetUrl = new URL(device.ngrokUrl + url.pathname + url.search)
    console.log(`[HederaEdge Router] Forwarding ${request.method} to: ${targetUrl.toString()}`)

    // Strip hop-by-hop headers that cause undici/fetch to fail
    const requestHeaders = new Headers()
    request.headers.forEach((val, key) => {
      const lower = key.toLowerCase()
      if (
        lower !== 'host' &&
        lower !== 'content-length' &&
        lower !== 'connection' &&
        lower !== 'keep-alive' &&
        lower !== 'transfer-encoding'
      ) {
        requestHeaders.set(key, val)
      }
    })
    requestHeaders.set('agent-address', agent.agentAddress)

    let body: string | null = null
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.text()
      } catch (e: any) {
        console.warn('[HederaEdge Router] Failed to read body:', e.message)
      }
    }

    try {
      const targetResponse = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: requestHeaders,
        body: body,
      })

      const responseBody = await targetResponse.text()
      const response = new NextResponse(responseBody, {
        status: targetResponse.status,
        statusText: targetResponse.statusText,
      })

      targetResponse.headers.forEach((val, key) => {
        if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
          response.headers.set(key, val)
        }
      })

      return response
    } catch (err: any) {
      console.error(`[HederaEdge Router] Failed to forward request to ${targetUrl}:`, err.message)
      return NextResponse.json(
        {
          error: "Edge device connection failed",
          target: targetUrl.toString(),
          details: err.message,
        },
        { status: 502 }
      )
    }

  } catch (error: any) {
    console.error('[HederaEdge Router] Middleware Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
