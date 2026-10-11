// Reads the customer's published content from the Dara IT portal (CMS v2).
// Fetched on the server, so the HTML already contains the content. If the
// portal is down or has no manifest yet, the defaults from cms/manifest.ts are
// used and the site looks exactly as before.
//
// Values are plain data: render them with {{ }} — never v-html.
import { cmsManifest, SITE_ORIGIN, type CmsFieldKey, type CmsListKey, type CmsRow, type CmsValue } from '~/cms/manifest'

type CmsContent = { fields: Record<string, CmsValue>; lists: Record<string, CmsRow[]> }

const defaults: CmsContent = {
  fields: Object.fromEntries(cmsManifest.fields.map(f => [f.key, f.default])),
  lists: Object.fromEntries(cmsManifest.lists.map(l => [l.key, l.default as unknown as CmsRow[]])),
}

export async function useCms() {
  const { customerId, portalUrl } = useRuntimeConfig().public.daraCms

  // Empty content (not null) on failure, so Nuxt doesn't refetch on the client;
  // missing keys fall back to the defaults below.
  const empty: CmsContent = { fields: {}, lists: {} }
  const { data } = await useAsyncData('dara-cms', async () => {
    if (!customerId) return empty
    try {
      return await $fetch<CmsContent>(`${portalUrl}/api/public/cms/v2/${customerId}`, { timeout: 4000 })
    }
    catch {
      return empty // 404 before the first manifest, or the portal is unreachable
    }
  })

  function list(key: CmsListKey): CmsRow[] {
    const rows = data.value?.lists?.[key]
    return Array.isArray(rows) ? rows : (defaults.lists[key] ?? [])
  }

  /** A saved value wins, even when empty ("" hides optional things like links). */
  function field(key: CmsFieldKey): CmsValue {
    const value = data.value?.fields?.[key]
    return value !== undefined && value !== null ? value : (defaults.fields[key] ?? null)
  }

  /** Trimmed text of a field. */
  const text = (key: CmsFieldKey) => cmsText(field(key))

  return { list, field, text }
}

/** Value as trimmed text ('' for empty/missing). */
export function cmsText(v: CmsValue | undefined): string {
  return v == null ? '' : String(v).trim()
}

/** Image URL; our own absolute URLs become local paths again. */
export function cmsImage(v: CmsValue | undefined): string {
  const url = cmsText(v)
  return url.startsWith(SITE_ORIGIN + '/') ? url.slice(SITE_ORIGIN.length) : url
}

/** Richtext split into non-empty lines. */
export function cmsLines(v: CmsValue | undefined): string[] {
  return cmsText(v).split('\n').map(l => l.trim()).filter(Boolean)
}

/** Richtext split into paragraphs on empty lines. */
export function cmsParagraphs(v: CmsValue | undefined): string[] {
  return cmsText(v).split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
}
