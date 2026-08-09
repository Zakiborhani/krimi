<script setup lang="ts">
import { onMounted, ref } from 'vue'

useHead({ title: 'About — Karimi Entertainment' })

const storyRef = ref<HTMLElement | null>(null)
const founderRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

const toggleAudio = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

const onAudioPlay = () => { isPlaying.value = true }
const onAudioPause = () => { isPlaying.value = false }
const onAudioEnded = () => { isPlaying.value = false }

onMounted(async () => {
  if (process.client) {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Story section
      gsap.fromTo(
        storyRef.value,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.value, start: 'top 80%' },
        }
      )

      // Founder section
      gsap.fromTo(
        founderRef.value,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: founderRef.value, start: 'top 80%' },
        }
      )

      // Stats
      gsap.fromTo(
        statsRef.value?.children ?? [],
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: statsRef.value, start: 'top 85%' },
        }
      )
    })
  }
})
</script>

<template>
  <main class="bg-bg-dark text-ink-light">

    <!-- Top spacing to clear navbar -->
    <div class="pt-28" />

    <!-- Story -->
    <section class="px-6 md:px-10 lg:px-16 py-24 md:py-32">
      <div ref="storyRef" class="max-w-site mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

          <!-- Left — label -->
          <div class="flex flex-col gap-4 md:sticky md:top-32">
            <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-gold">
              Since 2021
            </span>
            <p class="font-display text-3xl md:text-4xl font-light text-ink-light/80 leading-snug">
              Bringing the finest Afghan & Iranian artists to stages across Europe.
            </p>
          </div>

          <!-- Right — text -->
          <div class="flex flex-col gap-6 text-sm font-sans font-light text-ink-light/50 leading-relaxed">
            <p>
              Karimi Entertainment was born in Stockholm in 2021 with a single purpose — to give Afghan and Iranian communities across Europe access to the artists and performances they love, produced at the highest possible standard.
            </p>
            <p>
              From intimate theatrical venues to grand concert halls, every event carries the same commitment: a world-class experience that honours both the artists on stage and the audiences who travel from across the continent to be there.
            </p>
            <p>
              In just a few years, Karimi Entertainment has become one of Europe's most trusted names in Afghan and Iranian live entertainment — bringing together legendary artists, passionate audiences, and unforgettable nights.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-bg text-ink px-6 md:px-10 lg:px-16 py-16">
      <div class="max-w-site mx-auto">
        <div ref="statsRef" class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">

          <div class="flex flex-col gap-2">
            <span class="font-display text-5xl md:text-6xl font-light text-ink leading-none">2021</span>
            <span class="text-[10px] tracking-[0.25em] uppercase font-sans text-ink/60">Founded</span>
          </div>

          <div class="flex flex-col gap-2">
            <span class="font-display text-5xl md:text-6xl font-light text-ink leading-none">10<span class="text-crimson">+</span></span>
            <span class="text-[10px] tracking-[0.25em] uppercase font-sans text-ink/60">Events Produced</span>
          </div>

          <div class="flex flex-col gap-2">
            <span class="font-display text-5xl md:text-6xl font-light text-ink leading-none">6<span class="text-crimson">+</span></span>
            <span class="text-[10px] tracking-[0.25em] uppercase font-sans text-ink/60">Countries</span>
          </div>

          <div class="flex flex-col gap-2">
            <span class="font-display text-5xl md:text-6xl font-light text-ink leading-none">∞</span>
            <span class="text-[10px] tracking-[0.25em] uppercase font-sans text-ink/60">Memories Created</span>
          </div>

        </div>
      </div>
    </section>

    <!-- Founder -->
    <section class="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-ink-light/8">
      <div class="max-w-site mx-auto">
        <div ref="founderRef" class="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">

          <!-- Left — founder photo -->
          <div class="relative aspect-[3/4]">
            <!-- Decorative offset frames -->
            <div class="absolute -top-4 -left-4 w-full h-full rounded-2xl border border-crimson/60 -rotate-3 pointer-events-none" />
            <div class="absolute -top-2 -left-2 w-full h-full rounded-2xl border border-gold/60 -rotate-1 pointer-events-none" />

            <div class="relative w-full h-full overflow-hidden rounded-2xl">
              <img
                src="/images/mrkarim.jpeg"
                alt="Karim Karimi — Founder of Karimi Entertainment"
                class="w-full h-full object-cover object-center grayscale"
              />

              <audio
                ref="audioRef"
                src="/audio/founder-intro.mp3"
                preload="none"
                @play="onAudioPlay"
                @pause="onAudioPause"
                @ended="onAudioEnded"
              />

              <!-- Play button overlay -->
              <button
                type="button"
                @click="toggleAudio"
                class="absolute inset-0 flex items-center justify-center bg-bg-dark/0 hover:bg-bg-dark/20 transition-colors duration-400 group/audio"
                :aria-label="isPlaying ? 'Pause founder introduction' : 'Play founder introduction'"
              >
                <span
                  class="flex items-center justify-center w-16 h-16 rounded-full bg-gold/90 text-bg-dark shadow-lg transition-transform duration-400 group-hover/audio:scale-110"
                  :class="{ 'scale-105': isPlaying }"
                >
                  <svg v-if="!isPlaying" viewBox="0 0 24 24" class="w-6 h-6 ml-1" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                </span>
              </button>

              <!-- Listening badge -->
              <div
                v-if="isPlaying"
                class="absolute top-4 left-4 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-sans text-bg-dark bg-gold rounded-full px-4 py-1.5"
              >
                <span class="flex items-end gap-0.5 h-2.5">
                  <span class="w-0.5 bg-bg-dark audio-bar audio-bar-1" />
                  <span class="w-0.5 bg-bg-dark audio-bar audio-bar-2" />
                  <span class="w-0.5 bg-bg-dark audio-bar audio-bar-3" />
                </span>
                Listening
              </div>

              <!-- Gold bottom accent -->
              <div class="absolute bottom-0 left-0 right-0 h-px bg-gold/50" />
            </div>
          </div>

          <!-- Middle — founder identity -->
          <div class="flex flex-col gap-6 md:pt-4">
            <div class="flex items-center gap-5">
              <div class="w-8 h-px bg-gold" />
              <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-gold">
                The Founder
              </span>
            </div>
            <h2 class="font-display text-display-sm text-ink-light font-light leading-tight">
              Karim<br />Karimi
            </h2>
            <div class="w-12 h-px bg-gold/40" />
            <p class="text-[10px] tracking-[0.3em] uppercase font-sans text-ink-light/30">
              Founder & Director — Stockholm, Sweden
            </p>
          </div>

          <!-- Right — founder story -->
          <div class="flex flex-col gap-6 text-sm font-sans font-light text-ink-light/50 leading-relaxed md:pt-4">
            <p>
              Karim Karimi is the kind of person who makes things happen. Known for his relentless work ethic and infectious energy, he built Karimi Entertainment from the ground up — driven not by business alone, but by a genuine love for culture, music, and community.
            </p>
            <p>
              Where others saw gaps, Karim saw opportunity. He recognised that Afghan and Iranian communities across Europe deserved premium live experiences — and set out to deliver exactly that, one extraordinary event at a time.
            </p>
            <p>
              His vision is simple: no compromise on quality, no limit on ambition, and always — always — an unforgettable night for everyone in the room.
            </p>

            <NuxtLink
              to="/contact"
              class="founder-cta self-start mt-4 text-[10px] tracking-[0.25em] uppercase font-sans font-light px-6 py-3 border border-gold/50 text-gold hover:bg-gold hover:text-bg-dark transition-all duration-400"
            >
              Get in Touch
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.founder-cta {
  transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.audio-bar {
  animation: audio-bar-bounce 0.9s ease-in-out infinite;
}
.audio-bar-1 { height: 40%; animation-delay: 0s; }
.audio-bar-2 { height: 100%; animation-delay: 0.15s; }
.audio-bar-3 { height: 65%; animation-delay: 0.3s; }

@keyframes audio-bar-bounce {
  0%, 100% { height: 30%; }
  50% { height: 100%; }
}
</style>
