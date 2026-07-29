<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const { prefersReducedMotion } = useReducedMotion()
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <section class="relative w-full bg-[#2B1A1E] overflow-hidden">

    <!-- Mobile: tall crop that keeps all 4 artists in frame -->
    <!-- Desktop: full screen height -->
    <div class="relative w-full h-[75vh] min-h-[420px] md:h-screen md:min-h-[500px]">

      <!-- Hero Image -->
      <div
        :class="[
          'transition-opacity duration-[1400ms] ease-expo-out',
          'absolute left-0 right-0 bottom-0 top-[86px] md:top-[84px]',
          isLoaded || prefersReducedMotion ? 'opacity-100' : 'opacity-0'
        ]"
      >
        <img
          src="/images/hero1.jpeg"
          alt="Karimi Entertainment — Live Concerts in Europe"
          class="w-full h-full object-cover object-center"
          loading="eager"
          fetchpriority="high"
        />
      </div>

      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-[#2B1A1E] to-transparent pointer-events-none" />

      <!-- Scroll Indicator — desktop only -->
      <div
        :class="[
          'hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 transition-all duration-1000 delay-[1800ms] ease-expo-out',
          isLoaded || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        ]"
      >
        <span class="text-[9px] tracking-[0.3em] uppercase font-sans text-ink-light/40">Scroll</span>
        <div class="w-px h-10 bg-gradient-to-b from-ink-light/40 to-transparent animate-pulse" />
      </div>

    </div>

  </section>
</template>
