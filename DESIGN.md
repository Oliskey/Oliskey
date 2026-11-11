# Oliskey website — approved design record

This file records the decisions that are now locked (see `docs/DESIGN-CONSTITUTION.md`). New pages reuse these;
anything new needs explicit approval.

## Brand
- Logo: `src/components/Logo.tsx` — three interlocking rings, electric-blue arc, "Oliskey" wordmark. Rings use the text colour.
- Colours (tokens in `src/index.css`, names in `tailwind.config.js`):

| Token | Light (day) | Dark (night) | Use |
| --- | --- | --- | --- |
| page | #FFFFFF | #050B1A | page background |
| surface | #F5F7FB | #0B152C | quiet sections, image wells |
| raised | #FFFFFF | #0F1C38 | cards, sheets, panels |
| line | #E2E7F0 | #1F2D4E | hairlines |
| ink | #0A1A3A (navy) | #FFFFFF | primary text |
| muted | #485676 | #ACB8D4 | secondary text |
| accent | #1F6BFF (electric blue) | #4C8DFF | selection, icons, focus |
| accent-ink | #1558E0 | #80ACFF | links (≥4.5:1) |
| primary button | blue fill, white text | white fill, navy text | the one main action per area |

- Type: Inter Variable (self-hosted). Scale: `text-display` (hero), `text-title` (page), `text-section`, `text-lead`, body 16–17px. Titles use negative tracking.
- Spacing: 4/8 grid; page gutter 16/24/32px; sections 80–112px apart; max width 1200px.
- Radii: cards 22px, controls fully round (capsules), sheets 28px.

## Components
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-quiet` — 44px minimum, capsule, press scales to 0.97.
- Liquid glass (`.glass`) only on the floating navigation bar and small controls over imagery. Text panels over the 3D scene use `.scene-panel` (near-solid, blurred) so paragraphs stay readable.
- `ProductTile`: room still (day/night) + icon tile + name + tagline + one link. All product collections use it.
- `ProductSheet`: dialog opened from 3D displays and showroom buttons.
- `CTA`: navy band, white primary "Create your account". Ends most pages.

## Headquarters (3D)
- Source: `hq3d/` (Blender 5.3 via Python, not part of the site build). `build.py` models the building, `bake.py` bakes
  day and night light into lightmaps and exports one GLB per zone, `render.py` renders the Cycles stills, `publish.py`
  copies everything into `public/hq/`.
- Layout (Blender metres; three.js = x, z, −y): plaza and entrance (y < 0), reception and showroom (0–22),
  School (22–44), Fleet (44–66), Alpha (66–88), Labs (88–110). Wings are 22 m wide; doorways 7 m.
- Materials: white plaster, light stone, oak, navy accent wall, electric-blue details, keke yellow in Fleet.
- Light: day = sun from the front-right + physical sky + office lights at 55%; night = sky off, all interior lights,
  bollards, canopy downlights, sign light, pool glow. Screens glow brighter at night.
- Runtime: colour × baked light (`lightMapIntensity = scale × π`), AgX tone mapping, exposure 1.55 day / 1.0 night,
  room-environment reflections only on glossy surfaces. Screens show the real app screenshots matching the theme.
- Camera: stops in `src/three/stops.ts`. Each text block marked `data-stop` lines up with one stop; the camera glides
  (frame-rate independent) and passes through `via` points at doorways. Desktop and phone have separate compositions.
- Interaction: native scroll only (never hijacked); drag (mouse or finger) to look around — the view stays where it is
  left and scrolling eases it back toward the planned direction (~80% per stop). Choosing a world never moves the camera.
- Home walk: outside → glass doors (choose a world) → doors slide open → showroom → the world's display → cinematic cut
  inside → three stops → closing card (Learn more / Choose another world). Only the showroom and the chosen world load;
  the world's doorways are sealed so worlds never see each other.
- Always 3D (owner's decision): no still-picture fallback. A quiet veil with the Oliskey mark covers the moment before the
  scene is lit; if the browser drops the 3D it is rebuilt and resumes at the current stop.
- Performance: three.js/R3F load only on 3D pages (preloaded there with the first zone's GLB and lightmap); meshopt GLBs;
  phones/tablets get lite 3D (no props/effects, 1k plaza lightmap, DPR ≤ 1.25); rendering pauses off-screen.
- Surroundings: photographic HDRI sky + a code-built business district (towers, roads, trees, lamps) in every direction.

## Motion
- Page entrance 260 ms rise 10 px (`route-enter`); scroll reveals 0.7 s rise 24 px (GSAP ScrollTrigger, once).
- Easing tokens: respond (0.2,0.8,0.2,1), glide (0.32,0.72,0,1), exit (0.3,0,0.8,0.15).
- Reduce Motion: no reveals, no camera travel.

## Content rules
- Never invent testimonials, statistics, certifications or customers. Facts used: company name, city, product facts,
  School pricing per child per term (Free, Basic ₦1,000, Advanced ₦3,000) and the founding-school offer, from the owner.
