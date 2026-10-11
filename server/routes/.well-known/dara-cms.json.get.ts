// Publishes the CMS manifest for the Dara IT portal, which fetches it from the
// customer's website address — no keys or environment variables needed.
// The customer id lets the portal check that it is reading the right site.
import { cmsManifest } from '../../../app/cms/manifest'

export default defineEventHandler((event) => {
  setHeader(event, 'cache-control', 'public, max-age=300')
  return { ...cmsManifest, customerId: useRuntimeConfig().public.daraCms.customerId }
})
