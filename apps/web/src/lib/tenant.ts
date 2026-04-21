import { createServerClient } from '@laundrystrap/db'

export type ResolvedTenant = {
  id: string
  name: string
  slug: string
  primary_color: string
  accent_color: string
  font: string
  border_radius: string
  city: string | null
  service_areas: string[]
  tagline: string | null
  phone: string | null
  whatsapp: string | null
}

export function getSubdomainFromHost(host: string): string | null {
  const cleaned = host.split(':')[0]
  const parts = cleaned.split('.').filter(Boolean)
  if (parts.length < 3) return null // e.g. demo-abuja.laundrystrap.com
  return parts[0]
}

export async function resolveTenantByHost(host: string) {
  const subdomain = getSubdomainFromHost(host)
  if (!subdomain) return null

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tenants')
    .select(
      'id,name,slug,primary_color,accent_color,font,border_radius,city,service_areas,tagline,phone,whatsapp'
    )
    .eq('slug', subdomain)
    .eq('active', true)
    .maybeSingle()

  if (error) throw error
  return data as ResolvedTenant | null
}
