<script setup lang="ts">
// An image from the CMS. Our own images and images uploaded in the Dara IT
// portal go through Vercel image optimisation (resized to the shown size,
// WebP/AVIF), so a 2 MB poster upload stays small. Images from other
// domains are shown as they are: the optimiser only accepts the domains
// listed under image.domains in nuxt.config.ts.
// sizes uses Nuxt Image screen prefixes (xs:100vw md:340px); a bare "100vw"
// is misread as a 100 px width.
// eager loads the image straight away without raising its priority (e.g. logos
// in a moving strip, which lazy loading would pop in mid-animation).
const props = defineProps<{ src: string; alt: string; sizes?: string; priority?: boolean; eager?: boolean }>()

const OPTIMISED_HOSTS = ['portal-dara-it.com', 'www.karimientertainment.com', 'karimientertainment.com']

const optimise = computed(() => {
  if (props.src.startsWith('/')) return true
  try { return OPTIMISED_HOSTS.includes(new URL(props.src).hostname) }
  catch { return false }
})
</script>

<template>
  <NuxtImg
    v-if="optimise"
    :src="src"
    :alt="alt"
    :sizes="sizes ?? 'xs:100vw sm:100vw'"
    format="webp"
    quality="78"
    :loading="priority || eager ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : undefined"
    :preload="priority"
    decoding="async"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :loading="priority || eager ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : undefined"
    decoding="async"
  >
</template>
