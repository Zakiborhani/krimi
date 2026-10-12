<script setup lang="ts">
// Partners as edited in the Dara IT portal (list "partners" in cms/manifest.ts).
const { list } = await useCms()
const clients = list('partners')
  .map((row, i) => ({
    id: cmsText(row._id) || String(i),
    name: cmsText(row.name),
    logo: cmsImage(row.logo),
    url: cmsText(row.url),
  }))
  .filter(c => c.name)

// One half of the marquee strip; repeated so it is wider than the screen even
// with few partners. The strip holds two identical halves and slides by -50%.
const half = Array.from({ length: Math.max(1, Math.ceil(10 / Math.max(clients.length, 1))) }, () => clients).flat()
const strip = [...half, ...half]
</script>

<template>
  <section v-if="clients.length" id="clients" class="relative bg-bg-dark py-8 md:py-12 overflow-hidden">

    <!-- Top rule -->
    <div class="w-full h-px bg-ink-light/8 mb-6 md:mb-14" />

    <!-- Section Label -->
    <div class="flex items-center justify-center mb-6 md:mb-14">
      <div class="w-10 h-px bg-gold mr-6" />
      <span class="text-sm tracking-[0.4em] uppercase font-sans font-light text-ink-light/75">
        Our Partners
      </span>
      <div class="w-10 h-px bg-gold ml-6" />
    </div>

    <!-- Marquee Track -->
    <div class="relative flex overflow-hidden">

      <!-- Fade left edge -->
      <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none" />
      <!-- Fade right edge -->
      <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none" />

      <!-- Scrolling strip — duplicated for seamless loop -->
      <!-- Spacing is padding on each item, not a flex gap, so the two halves are
           exactly equal and the -50% loop point lines up without a visible jump. -->
      <div class="marquee-track flex items-center whitespace-nowrap" :style="{ animationDuration: `${half.length * 2.5}s` }">
        <component
          :is="client.url ? 'a' : 'div'"
          v-for="(client, i) in strip"
          :key="`${client.id}-${i}`"
          :href="client.url || undefined"
          :target="client.url ? '_blank' : undefined"
          :rel="client.url ? 'noopener noreferrer' : undefined"
          :aria-hidden="i >= clients.length ? 'true' : undefined"
          :tabindex="i >= clients.length ? -1 : undefined"
          class="flex items-center shrink-0 pr-16"
        >
          <!-- Real logo -->
          <CmsImg
            v-if="client.logo"
            :src="client.logo"
            :alt="client.name"
            sizes="240px"
            class="h-12 w-auto object-contain"
          />

          <!-- Text placeholder until real logos are provided -->
          <span
            v-else
            class="font-display text-3xl font-light tracking-widest text-ink-light hover:text-gold transition-colors duration-500 uppercase select-none"
          >
            {{ client.name }}
          </span>
        </component>
      </div>

    </div>

    <!-- Bottom rule -->
    <div class="w-full h-px bg-ink/8 mt-6 md:mt-14" />

  </section>
</template>

<style scoped>
.marquee-track {
  animation: marquee 20s linear infinite;
  will-change: transform;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
