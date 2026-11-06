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
    
    // Ignore static files, internal database APIs, telemetry, dashboard, mobile, Next.js internal files
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/agent') ||
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/mobile') ||
      url.pathname.startsWith('/fonts') ||
      url.pathname.startsWith('/favicon.ico') ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|otf|ttf)$/)
    ) {
      return NextResponse.next()
    }

    // Check if we're on the main root domain without subdomain
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

    console.log(`[HederaEdge Router] Routing subdomain: "${subdomain}" on path: ${url.pathname}`)

    // For web requests on the root path, rewrite cleanly to native Next.js page component
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
      const agentPageUrl = new URL(`/agent/${subdomain}`, request.url)
      return NextResponse.rewrite(agentPageUrl)
    }

    // For direct API requests through subdomain to edge device, forward to registered device URL
    const origin = url.origin
    const agentResponse = await fetch(
      `${origin}/api/db/agents?subname=${encodeURIComponent(subdomain)}`
    )

    if (agentResponse.ok) {
      const agent: Agent = await agentResponse.json()
      if (agent && agent.deviceAddress) {
        const deviceResponse = await fetch(
          `${origin}/api/db/devices?address=${encodeURIComponent(agent.deviceAddress)}`
        )
        if (deviceResponse.ok) {
          const device: Device = await deviceResponse.json()
          if (device && device.ngrokUrl && device.status === 'Active') {
            const targetUrl = new URL(device.ngrokUrl + url.pathname + url.search)
            return NextResponse.rewrite(targetUrl)
          }
        }
      }
    }

    return NextResponse.next()
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
