<script setup lang="ts">
import { onMounted, ref } from 'vue'

useHead({ title: 'Contact — Karimi Entertainment' })

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (import.meta.client) {
    const { gsap } = await import('gsap')

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        headerRef.value,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        contentRef.value,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 }
      )
    })
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative min-h-screen bg-bg text-ink flex items-center px-6 md:px-10 lg:px-16 py-32"
  >
    <div class="max-w-site mx-auto w-full">
      <div class="max-w-2xl mx-auto text-center">

        <!-- Section Label -->
        <div ref="headerRef" class="flex items-center justify-center gap-5 mb-8">
          <div class="w-8 h-px bg-crimson" />
          <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-crimson">
            Get in Touch
          </span>
          <div class="w-8 h-px bg-crimson" />
        </div>

        <!-- Headline -->
        <h1 class="font-display text-display-sm text-ink font-light leading-none mb-6">
          Let's Create<br />Something<br />Unforgettable.
        </h1>

        <!-- Subline -->
        <p class="text-sm font-sans font-light text-ink/65 tracking-wide mb-16 leading-relaxed">
          For bookings, partnerships, and general enquiries.
        </p>

        <!-- Contact Items -->
        <div ref="contentRef" class="flex flex-col items-center gap-8">

          <!-- Phone -->
          <a
            href="tel:+46729190716"
            class="contact-item group flex items-center gap-5"
          >
            <div class="hidden sm:block w-10 h-px bg-crimson/30 group-hover:bg-crimson transition-colors duration-400" />
            <div class="flex flex-col items-center gap-1">
              <span class="text-[9px] tracking-[0.35em] uppercase font-sans text-ink/60 group-hover:text-crimson/70 transition-colors duration-400">
                Phone
              </span>
              <span class="font-display text-2xl md:text-3xl font-light text-ink/75 group-hover:text-ink tracking-wide transition-colors duration-400">
                +46 72 919 07 16
              </span>
            </div>
            <div class="hidden sm:block w-10 h-px bg-crimson/30 group-hover:bg-crimson transition-colors duration-400" />
          </a>

          <!-- Divider -->
          <div class="w-px h-8 bg-ink/15" />

          <!-- Email -->
          <a
            href="mailto:info@karimientertainment.com"
            class="contact-item group flex items-center gap-5"
          >
            <div class="hidden sm:block w-10 h-px bg-crimson/30 group-hover:bg-crimson transition-colors duration-400" />
            <div class="flex flex-col items-center gap-1">
              <span class="text-[9px] tracking-[0.35em] uppercase font-sans text-ink/60 group-hover:text-crimson/70 transition-colors duration-400">
                Email
              </span>
              <span class="font-display text-base md:text-2xl font-light text-ink/75 group-hover:text-ink tracking-wide transition-colors duration-400">
                info@karimientertainment.com
              </span>
            </div>
            <div class="hidden sm:block w-10 h-px bg-crimson/30 group-hover:bg-crimson transition-colors duration-400" />
          </a>

          <!-- Divider -->
          <div class="w-px h-8 bg-ink/15" />

          <!-- Social Icons -->
          <div class="flex items-center gap-8">
            <a
              href="https://www.instagram.com/karimi_entertainment/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="group flex flex-col items-center gap-2 text-ink/65 hover:text-crimson transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              <span class="text-[9px] tracking-[0.25em] uppercase font-sans">Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/karimientertainment/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="group flex flex-col items-center gap-2 text-ink/65 hover:text-crimson transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span class="text-[9px] tracking-[0.25em] uppercase font-sans">Facebook</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-item {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.contact-item:hover {
  transform: scale(1.02);
}
</style>
