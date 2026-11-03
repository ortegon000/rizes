---
target: homepage RÍZES / src/pages/index.tsx
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:/Users/ortegon/Dev/rizes/src/pages/index.tsx"
target_fingerprint: "sha256:d993d256a224b35b61127c7439c01538bef37fbeb12311ca116105c57b8e8aa6"
target_path: /Users/ortegon/Dev/rizes/src/pages/index.tsx
timestamp: 2026-11-03T18-30-12Z
slug: src-pages-index-tsx
---
Method: dual-agent (A: ce94ad37-fc3c-4a6a-8c11-55971563feb7 · B: c0ddecda-000a-40b2-96d1-11414d34dc18)

Target: src/pages/index.tsx (RÍZES homepage / Persuade)
Visual: live localhost:3000 + detector overlay

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | “Sigue Bajando” persiste; sin progreso global; canvas/hero sin feedback de carga |
| 2 | Match System / Real World | 3 | Español fuerte; “Home” en inglés y jerga ATL/BTL rompen el mundo |
| 3 | User Control and Freedom | 2 | Scroll ~29k px + Lenis/overlays coercitivos; pocos anclajes útiles |
| 4 | Consistency and Standards | 2 | Gradiente rojo→azul en casi todo; copy repetida; EN/ES mix |
| 5 | Error Prevention | 2 | Contacto es tipografía, no CTA/mailto claro; menú sin nombre accesible |
| 6 | Recognition Rather Than Recall | 2 | Wayfinding débil; logos clientes sin nombre; alts vacíos |
| 7 | Flexibility and Efficiency | n/a | Persuade landing |
| 8 | Aesthetic and Minimalist Design | 2 | Hero disciplinado; mid-page muro de claims + 13 servicios |
| 9 | Error Recovery | 3 | Overlays y reduce-motion OK; sin UX si canvas falla |
| 10 | Help and Documentation | n/a | Persuade |
| **Total** | | **18/32** | Fair — espectáculo fuerte, conversión/wayfinding débiles |

## Design Specificity Verdict

**LLM:** Composición y media sí son de RÍZES (hero mask, foto de producción, voz mexicana, split rojo/azul del mark). Tipografía Arial y el mismo gradient clip en casi todos los titulares son filtraciones genéricas de agency landing. Si cambias logo y fotos, media UI seguiría sirviendo a otra productora.

**Deterministic scan:** CLI exit 2 → 15 findings: gradient-text ×10, bounce-easing ×4 (advisory), overused-font ×1 (Arial). Live overlay: 26 findings (gradient-text inflado por `[&>li]` en services). Falsos positivos probables: bounce por nombre `bounce-pulse`/ease-in-out; Arial vs lista Inter/Roboto; gradient-text sobre icono del hero.

**Visual overlays:** Inyectados en tab Assessment B durante el run; labels de gradient-text en wordmark/icono y badges de Arial + bounce.

## Overall Impression

El open es cine de marca. El mid-page gasta ese peak repitiendo “impecable / pasión / fronteras” con el mismo tratamiento tipográfico. El end no cierra la venta: atmósfera sí, decisión no.

## What's Working

1. Hero como teatro de marca (foto full-bleed + mask + mark neón).
2. Fotografía de producción real como prueba (consolas, escenarios).
3. Motion ambicioso con path `prefers-reduced-motion` serio.

## Priority Issues

**[P0] Conversión enterrada**
- What: Tras el reveal no hay ask; contacto llega tarde como email tipográfico.
- Why: Persuade sin next step = share del hero y abandono.
- Fix: Tras reveal/intro: promesa corta + CTA (WhatsApp/mailto/form). Footer/team como botones reales.
- Suggested: /impeccable clarify + /impeccable polish

**[P1] Tipografía no es marca**
- What: Arial global; casi todo headline = from-red to-blue clip.
- Why: Prestigio de 30 años se lee como template bien fotografiado.
- Fix: 1 display + 1 text con carácter; gradiente solo en 1–2 momentos firma.
- Suggested: /impeccable typeset

**[P1] Meseta narrativa + repetición**
- What: Capítulos reestan claims; 13 servicios a mismo peso.
- Why: Fatiga antes de clientes/contacto.
- Fix: 3 beats (quiénes / alcance / prueba); servicios en 3–4 buckets; lista larga solo en galería.
- Suggested: /impeccable distill + /impeccable layout

**[P2] Wayfinding vs canvas fijo**
- What: Saltos de menú a secciones transparentes sobre frames; “Sigue Bajando” no muere.
- Why: “¿dónde estoy?” / sensación de contenido roto.
- Fix: Scrim sólido en beats narrativos; ocultar hint post-hero; progreso o label de sección.
- Suggested: /impeccable adapt + /impeccable quieter

**[P2] Accesibilidad / recognition de prueba**
- What: Menú sin aria-label; alts vacíos; logos sin nombre; “Home”.
- Why: SR y stakeholders brand-conscious pierden la prueba.
- Fix: aria-label; alts/figcaptions; “Inicio”; scrim en header sobre frames claros.
- Suggested: /impeccable harden + /impeccable clarify

## Persona Red Flags

**Jordan (prospecto primerizo):** Awe sin CTA; mapa mental de 29k px; magia > prueba → comparte hero, no convierte.
**Sam (planner móvil):** Lenis + canvas + hint = trabajo; galería horizontal confusa; contact late → abandona.
**Riley (stakeholder de marca):** Arial + gradient spam = agency genérica; logo salad sin nombres; “Home” EN → mata en brand review.

## Minor Observations

- Menú open (blur + logo gigante) es fuerte — localizar “Home”.
- Hover border-8 en fotos: firma o exceso.
- Banner clip-path: buen break de forma.
- Typo `md:ext-4xl`; document title vacío; services BG `#baa6f4` sale del mundo rojo/azul; teléfonos no tappable.

## Questions to Consider

1. Si el mask reveal es el mejor segundo de marca, ¿por qué el ask vive en el último 10%?
2. ¿Cómo se vería RÍZES si el type cargara tanta identidad como los lasers?
3. ¿“Sigue Bajando” es hospitalidad o una confesión de que el beat no sabe terminar?
