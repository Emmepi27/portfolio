# Performance panel — 10 secondi di verità

Record 5–10 s su home con background attivo. Criteri: niente long task ricorrenti > 50 ms, frame time stabile, resize senza layout thrash.

---

## Procedura manuale

1. Avvia l’app: `npm run start` (o `npm run dev`).
2. Apri **Chrome** → `http://localhost:3000/`.
3. **DevTools** (F12) → tab **Performance**.
4. (Opzionale) Device toolbar **Mobile** (Ctrl+Shift+M) per emulare mobile.
5. Clic **Record** (cerchio), attendi **5–10 secondi** con la pagina in vista (background attivo).
6. (Opzionale) A metà recording **ridimensiona** la finestra 2–3 volte per testare il resize.
7. Clic **Stop**.
8. **Salva trace**: pulsante Save (icona download) → **Save profile** → es. `perf-home-10s.json`.

---

## Cosa controllare nel flame chart

- **Long task > 50 ms:** barre gialle/rosse lunghe nella parte **Main** del trace. Non devono ripetersi a ogni frame (es. ogni ~16 ms o ~33 ms). Se ci sono 2–3 picchi isolati è accettabile; se sono ricorrenti → fail.
- **Frame time:** nella timeline, i frame (blocchi tra due "Composite" o "Rasterize") devono essere circa **16–17 ms** (60 fps) o **33 ms** (30 fps). Nessun blocco costantemente > 50 ms.
- **Resize thrash:** dopo il resize non devono comparire **molti** eventi **Layout** / **Recalculate Style** in pochi millisecondi (es. 10+ in una finestra di 100 ms). Se sì → possibile layout thrash.

---

## Analisi automatica del trace

Dopo aver salvato il profile in un file JSON:

```bash
npm run perf:analyze -- path/to/perf-home-10s.json
```

Lo script:

- Conta i **long task > 50 ms** (in particolare main-thread / script) e segnala se sono ricorrenti.
- Conta gli eventi **Layout/Recalculate** e il massimo in una finestra di 100 ms (burst = possibile thrash).
- Calcola **intervalli tra frame** (CompositeLayers/Display) e media/stdev del frame time.

**Criteri in output:**

- **Nessun long task ricorrente > 50 ms:** OK se nessuno o pochissimi; FAIL se ricorrenti.
- **Resize/layout senza thrash:** OK se max layout in 100 ms < 8; FAIL altrimenti.
- **Frame time (stdev):** OK se stdev < 15 ms; altrimenti da verificare a mano.

---

## Riepilogo criteri

| Criterio | Cosa guardare | Pass |
|----------|----------------|------|
| Long task | Nessun long task ricorrente > 50 ms | Zero o quasi, non a ogni frame |
| Frame time | Stabile (60 fps ≈ 16 ms, 30 fps ≈ 33 ms) | Stdev bassa, nessun frame costantemente > 50 ms |
| Resize | Nessun layout/recalc a raffica | Max layout in 100 ms < 8 |
