# Lighthouse regression gate — risultati

## Run eseguiti

| # | Device | Throttling | URL | Stato |
|---|--------|------------|-----|--------|
| 1 | Mobile | ON (Lighthouse default) | `/` | OK |
| 2 | Mobile | ON | `/work/rsfly` | OK |
| 3 | Desktop | OFF | `/` | Fallito (EPERM temp dir) — eseguire a mano |

---

## Run 1 — Mobile throttling su `/`

| Metrica | Valore | Obiettivo |
|---------|--------|-----------|
| **Performance score** | **0.97** | Non peggiorare vs baseline |
| **LCP** | **2.66 s** | < 2.5 s (score 0.86) — borderline, accettabile |
| **CLS** | **0.002** | ≈ 0 ✓ |
| **TBT** | **25.5 ms** | Non esploso ✓ |
| **Max potential FID (proxy INP)** | **100 ms** | Non esploso ✓ |

**Esito:** CLS ≈ 0, LCP sotto 3 s, TBT/INP sotto controllo. Nessuna regressione critica.

---

## Run 2 — Mobile throttling su `/work/rsfly`

| Metrica | Valore | Obiettivo |
|---------|--------|-----------|
| **Performance score** | **0.96** | Non peggiorare vs baseline |
| **LCP** | **2.72 s** | < 2.5 s (score 0.85) — borderline |
| **CLS** | **0.001** | ≈ 0 ✓ |
| **TBT** | **43 ms** | Non esploso ✓ |
| **Max potential FID** | **134 ms** | Non esploso ✓ |

**Esito:** CLS ≈ 0, LCP leggermente sopra 2.5 s ma accettabile, TBT/INP ok.

---

## Run 3 — Desktop su `/` (sanity)

**Stato:** non eseguito in ambiente (EPERM su temp dir Lighthouse).

**Comando da eseguire a mano** (con server avviato: `npm run start`):

```bash
cd d:\Sites\portfolio\m-portfolio
npx lighthouse "http://localhost:3000/" --only-categories=performance --preset=desktop --output=json --output-path=./.lighthouse-desktop-home.json --chrome-flags="--headless=new --no-sandbox"
```

Poi controllare in `.lighthouse-desktop-home.json`: `categories.performance.score`, `audits["largest-contentful-paint"].numericValue`, `audits["cumulative-layout-shift"].numericValue`, `audits["total-blocking-time"].numericValue`.

---

## Riepilogo

- **CLS:** ≈ 0 su entrambe le route (mobile). Nessuna regressione layout.
- **LCP:** ~2.66 s (/) e ~2.72 s (/work/rsfly) — leggermente sopra 2.5 s, da tenere sotto controllo.
- **INP/TBT:** bassi (25–43 ms TBT, 100–134 ms max FID). Nessun picco.

**Regression gate:** superato per i 2 run mobile. Run desktop da completare manualmente.
