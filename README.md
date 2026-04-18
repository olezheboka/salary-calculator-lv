# Salary Calculator — Latvia

Client-side salary (bruto ↔ neto) calculator for Latvia, supporting 2025 and 2026 tax rules. Three-language UI (LV/EN/RU), no backend, all state is in the URL so results are shareable.

Built with Vite + React 19 + TypeScript + Tailwind, deployed on Vercel.

## Develop

```sh
npm install        # Node ≥ 20.19
npm run dev        # start Vite dev server
npm run lint       # type-aware ESLint
npm run build      # tsc -b && vite build
npm run preview    # serve the production build locally
```

## Project layout

```
src/
  App.tsx                      # orchestrator: state, URL sync, layout
  main.tsx                     # React root
  index.css                    # Tailwind entry
  lib/tax/
    config.ts                  # TAX_CONFIG (edit here to add a new year)
    calculator.ts              # pure calculateTaxFromGross / calculateGrossFromNet
    round.ts, types.ts
  lib/url-state.ts             # DEFAULTS, getInitialState, buildUrlSearch
  i18n/translations.ts         # LV / EN / RU strings
  components/
    Flags.tsx, AnimatedCounter.tsx, TableRow.tsx
```

## Adding or updating a tax year

Edit `src/lib/tax/config.ts` — add a new entry keyed by year and update `SUPPORTED_YEARS`. No other file changes needed for math; the year selector buttons in `App.tsx` use a hard-coded `[2025, 2026]` list that will need an entry.

## Deploy

Vercel picks up the repo automatically. `vercel.json` at the repo root configures the SPA rewrite, immutable caching on `/assets/*`, and security headers (CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options).
