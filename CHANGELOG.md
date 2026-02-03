# Changelog

## Background system (policy-driven)

- **Policy-driven, not effect-driven:** FPS, DPR, and “running” come from a single policy (device, reduced-motion, save-data, zones). The canvas only reacts to policy output; it does not drive decisions.
- **Zones + demand rendering:** Hero/selection/main/footer (and menu overlay) have different density and FPS caps. The loop stops in footer/menu; in selection/main we draw less and cap FPS to keep scroll smooth.
- **Perf budget:** Static layer (bg + dots) and glow sprite are pre-rendered; per frame we do one `drawImage` plus lines/nodes. Integer hash replaces `Math.sin` in the hot path. `desynchronized: true` on the 2D context where supported.
- **Product mode:** `?bg=off` disables the background; `?bg=debug` shows zone, fps, dpr, density, profile in the corner for validation and demos.
- **Engineering artifact:** The background is treated as a constrained subsystem (policy → state → render), not a one-off effect—documented, toggleable, and debuggable.
