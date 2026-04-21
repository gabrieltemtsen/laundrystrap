import { NextResponse, type NextRequest } from 'next/server'
import { resolveTenantByHost } from '@/lib/tenant'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''

  // In local dev, allow demo tenant via ?tenant=demo-abuja
  const url = new URL(req.url)
  const devTenant = url.searchParams.get('tenant')
  const lookupHost = devTenant ? `${devTenant}.laundrystrap.com` : host

  try {
    const tenant = await resolveTenantByHost(lookupHost)
    if (!tenant) return NextResponse.next()

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-tenant-id', tenant.id)
    requestHeaders.set('x-tenant-name', tenant.name)
    requestHeaders.set('x-tenant-slug', tenant.slug)
    requestHeaders.set('x-tenant-primary', tenant.primary_color)
    requestHeaders.set('x-tenant-accent', tenant.accent_color)
    requestHeaders.set('x-tenant-font', tenant.font)
    requestHeaders.set('x-tenant-radius', tenant.border_radius)

    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    return NextResponse.next()
  }
}
