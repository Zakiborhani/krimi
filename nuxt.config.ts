export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  fonts: {
    families: [
      { name: 'Cormorant Garamond', provider: 'google', weights: [300, 400, 500, 600, 700], styles: ['normal', 'italic'] },
      { name: 'DM Sans', provider: 'google', weights: [300, 400, 500, 600] },
    ],
  },

  css: ['~/assets/css/main.css'],

  // Dara IT portal CMS (v2). The customer id is public. The portal fetches the
  // manifest from /.well-known/dara-cms.json, so no keys are needed.
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      daraCms: {
        customerId: 'e444fbfa-6fbe-46ef-b6c6-ac005adc249c',
        portalUrl: 'https://portal-dara-it.com',
      },
    },
  },

  // Events, contact details and the footer come from the portal (the footer is
  // on every page); re-render at most once a minute.
  routeRules: {
    '/': { isr: 60 },
    '/about': { isr: 60 },
    '/artists': { isr: 60 },
    '/contact': { isr: 60 },
    '/events/**': { isr: 60 },
  },

  app: {
    head: {
      title: 'Karimi Entertainment',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Premium Afghan & Iranian concerts across Europe. Live music experiences by Karimi Entertainment.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Vercel image optimisation (via <CmsImg>) for our own images and images
  // uploaded in the Dara IT portal.
  image: {
    domains: ['portal-dara-it.com', 'www.karimientertainment.com', 'karimientertainment.com'],
    format: ['avif', 'webp'],
    // Extra width for the mobile hero slides: phones crop the landscape photos
    // to a tall frame, so the full ~1800 px width is needed for a sharp crop.
    screens: { slide: 1800 },
  },

  typescript: {
    strict: true,
  },
})
