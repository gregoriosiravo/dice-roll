# D&D Dice Roller

A Nuxt 3 web app for Dungeons & Dragons players to roll polyhedral dice online — attacks, saving throws, damage, and percentile tables.

## Features

- **Quick dice** — One-tap rolls for d4, d6, d8, d10, d12, d20, and d100
- **Custom notation** — Roll expressions like `2d6+3`, `1d20+5`, or `4d6`
- **Advantage & disadvantage** — Roll 2d20 and keep the higher or lower (for 1d20 rolls)
- **Modifiers** — Add your proficiency bonus or ability modifier
- **Roll history** — Review your last 20 rolls at the table
- **Natural 20 / 1** — Highlights critical hits and critical fails on d20

## Setup

```bash
git clone https://github.com/sirap95/dice-roll.git
cd dice-roll
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Pages

The app is deployed to [https://gregoriosiravo.github.io/dice-roll/](https://gregoriosiravo.github.io/dice-roll/) (project site). The base path is set via `NUXT_APP_BASE_URL=/dice-roll/` in the GitHub Actions workflow.

In **Settings → Pages**, set **Build and deployment** source to **GitHub Actions** (not “Deploy from a branch”).

To preview the production build locally:

```bash
NUXT_APP_BASE_URL=/dice-roll/ npm run generate
npx serve .output/public
```

Then open `http://localhost:3000/dice-roll/`.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Build for production     |
| `npm run generate` | Static export for GitHub Pages |
| `npm run preview` | Preview production build |

## Tech stack

- [Nuxt 3](https://nuxt.com/)
- Vue 3 Composition API
- TypeScript

## D&D notation

| Notation | Example use                          |
| -------- | ------------------------------------ |
| `1d20`   | Attack roll, ability check, save     |
| `2d6+3`  | Greatsword damage + Strength         |
| `8d6`    | Fireball damage                      |
| `1d100`  | Random table (percentile)            |

Advantage and disadvantage only apply when rolling exactly **1d20**.
