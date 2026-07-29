<script setup lang="ts">
interface Client {
  id: string
  name: string
  logo: string | null
}

const clients: Client[] = [
  { id: '1', name: 'Dara-it.com', logo: null },
  { id: '2', name: 'AFAS Live', logo: null },
  { id: '3', name: 'Elbphilharmonie', logo: null },
  { id: '4', name: 'Olympia Paris', logo: null },
  { id: '5', name: 'Royal Albert Hall', logo: null },
  { id: '6', name: 'Ticketmaster', logo: null },
  { id: '7', name: 'Eventim', logo: null },
  { id: '8', name: 'Live Nation', logo: null },
]
</script>

<template>
  <section id="clients" class="relative bg-bg-dark py-12 overflow-hidden">

    <!-- Top rule -->
    <div class="w-full h-px bg-ink-light/8 mb-14" />

    <!-- Section Label -->
    <div class="flex items-center justify-center mb-14">
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
      <div class="marquee-track flex items-center gap-16 whitespace-nowrap">
        <div
          v-for="(client, i) in [...clients, ...clients]"
          :key="`${client.id}-${i}`"
          class="flex items-center shrink-0"
        >
          <!-- Real logo -->
          <img
            v-if="client.logo"
            :src="client.logo"
            :alt="client.name"
            class="h-12 w-auto object-contain opacity-50 hover:opacity-90 transition-opacity duration-300 grayscale hover:grayscale-0"
          />

          <!-- Text placeholder until real logos are provided -->
          <span
            v-else
            class="font-display text-3xl font-light tracking-widest text-ink-light/55 hover:text-gold transition-colors duration-500 uppercase select-none"
          >
            {{ client.name }}
          </span>
        </div>
      </div>

    </div>

    <!-- Bottom rule -->
    <div class="w-full h-px bg-ink/8 mt-14" />

  </section>
</template>

<style scoped>
.marquee-track {
  animation: marquee 28s linear infinite;
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
