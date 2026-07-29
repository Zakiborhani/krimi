<script setup lang="ts">
const currentYear = new Date().getFullYear()

const navLinks = [
  { label: 'Events', to: '/#events' },
  { label: 'Artists', to: '/artists' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const socials = [
  { label: 'Instagram', url: '#' },
  { label: 'Facebook', url: '#' },
]
</script>

<template>
  <footer class="relative bg-bg text-ink overflow-hidden">

    <!-- Top line -->
    <div class="w-full h-px bg-ink/10" />

    <!-- Main Footer Content -->
    <div class="max-w-site mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

        <!-- Col 1 — Brand -->
        <div class="flex flex-col gap-5">
          <div>
            <img
              src="/images/karimi-logo-white.png"
              alt="Karimi Entertainment"
              class="footer-logo h-14 md:h-16 w-auto select-none"
              width="1007"
              height="537"
            >
          </div>
          <p class="text-sm font-sans font-light text-ink-muted leading-relaxed max-w-xs">
            Bringing the finest Afghan & Iranian artists to stages across Europe.
          </p>
          <a
            href="/#events"
            class="footer-cta self-start text-[10px] tracking-[0.25em] uppercase font-sans font-light px-5 py-2.5 border border-ink/50 text-ink"
          >
            Get Tickets
          </a>
        </div>

        <!-- Col 2 — Navigation -->
        <div class="flex flex-col gap-4">
          <p class="text-[9px] tracking-[0.35em] uppercase font-sans text-ink/60 mb-2">
            Navigate
          </p>
          <ul class="flex flex-col gap-3">
            <li v-for="link in navLinks" :key="link.label">
              <a
                :href="link.to"
                class="text-sm font-sans font-light text-ink/80 hover:text-crimson transition-colors duration-300 tracking-wide"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Col 3 — Social & Contact -->
        <div class="flex flex-col gap-4">
          <p class="text-[9px] tracking-[0.35em] uppercase font-sans text-ink/60 mb-2">
            Follow Us
          </p>
          <div class="flex items-center gap-5">

            <!-- Instagram -->
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="text-ink/70 hover:text-crimson transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            <!-- Facebook -->
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="text-ink/70 hover:text-crimson transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>

          </div>
          <div class="mt-4 pt-4 border-t border-ink/15">
            <p class="text-[10px] tracking-[0.15em] font-sans text-ink/65">
              info@karimientertainment.com
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-ink/15">
      <div class="max-w-site mx-auto px-6 md:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-[10px] tracking-[0.15em] font-sans text-ink/55">
          © {{ currentYear }} Karimi Entertainment. All rights reserved.
        </p>
        <div class="flex items-center gap-3">
          <p class="text-[10px] tracking-[0.15em] font-sans text-ink/50">
            Premium Concerts Across Europe
          </p>
          <span class="text-ink/30">·</span>
          <a
            href="https://dara-it.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[10px] tracking-[0.15em] font-sans text-ink/60 hover:text-crimson transition-colors duration-300"
          >
            Website Design & Development — dara-it.com
          </a>
        </div>
      </div>
    </div>

  </footer>
</template>

<style scoped>
.footer-logo {
  filter: invert(1);
}
.footer-cta {
  transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.footer-cta:hover {
  background-color: #00FF90;
  color: #002429;
}
</style>
