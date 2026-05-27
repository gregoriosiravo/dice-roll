/// <reference types="node" />

// GitHub Pages project site: https://<user>.github.io/dice-roll/
const baseURL = process.env.NUXT_APP_BASE_URL || '/dice-roll/'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  nitro: {
    preset: 'github_pages',
  },
  devtools: { enabled: true },
  app: {
    baseURL,
    head: {
      title: 'D&D Dice Roller',
      meta: [
        {
          name: 'description',
          content:
            'Roll D&D dice online — d4, d6, d8, d10, d12, d20, and d100 with advantage, disadvantage, and custom notation.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
})
