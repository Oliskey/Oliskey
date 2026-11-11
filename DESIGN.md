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


### Alpha trading floor (realism pass, 2026-11-11)
Why it looked like a toy before, and what fixed it:
- **Scale.** Desks were 0.38 m high and chairs knee-high. Now: desks 0.74 m, monitors on arms at seated eye level, seats 0.47 m.
- **Box furniture.** Each workstation is modelled once in Blender: walnut desk on steel T-legs, low acoustic screen, three
  24-inch monitors on an arm, keyboard, mouse, desk phone, mug and notebook, and a mesh task chair on a five-star base.
  It is drawn as instances (one draw call per part). Every other desk is mirrored, and empty chairs are pushed back and
  turned, so the floor does not repeat.
- **Low-resolution, noisy light.** The room lightmap went from 1k to 2k, the furniture moved out of it, and its islands are
  padded so the browser can use three mip levels. That removes the shimmer on far ceilings and floors. The workstation and
  the people carry their own baked textures (colour × light, reflections included).
- **Surfaces.** Charcoal carpet tiles, a mineral-tile ceiling at 4.25 m with 0.6 × 1.2 m LED panels, and a walnut slat wall
  carrying the LED video wall. This replaces the brown floor, the stucco ceiling and the black slab.
- **Life.** 14 traders (posed rigged characters in recoloured office clothes):
  - some celebrate a won practice trade, arms up, and one colleague stands and cheers;
  - others lean back while their trade counts down.
- **Their screens say the same.** Each trader's right-hand monitor shows "Trade closed · Won" or "Trade open · waiting for
  close". The centre monitor shows the real Alpha app, and the far wall has the app plus a live demo-trade board.
- **Labelled as practice.** Every price and result shown is labelled demo or practice credits.
- **Live clocks.** World clocks show the real time in Lagos, London, New York and Tokyo.
- **Phones.** Phones now render with hardware anti-aliasing at 1.5× pixel density, so there are no stair-stepped edges.


### School world (2026-11-11)
- **Four spaces:**
  - JSS 1A and JSS 2B classrooms at the front, each with a smartboard lesson, a whiteboard and cork boards.
  - The school office at the back right, with the admin dashboard on two monitors and a wall display.
  - A parent's home office at the back left. It is reached by a cut because it is not in the school.
- **Camera path:** the room tour walks through real doorways between the classrooms and into the office.
- **Cast:** Microsoft Rocketbox characters (MIT licence), recoloured into a Nigerian school.
  - Students wear white shirts with navy bottoms; two girls wear a hijab with a green dress.
  - Skin tones are deep, brown and warm, and the children have black hair.
  - The full cast is shown on the character sheet (16 students, 2 teachers, the admin and a parent).
- **Every role is on its own dashboard:**
  - Students: student dashboard on laptops. Three of them raise a hand to ask a question.
  - Teachers: teacher dashboard and smartboard lessons.
  - Admin: the real Admin Dashboard.
  - Parent: parent dashboard (attendance, result, fees, a message from the teacher, report card).
  - The student, teacher and parent dashboards are drawn in the app's style with demo data.
- **Build:**
  - The room uses a 2k lightmap with padded islands (mipmapped, like the trading floor).
  - People keep their own textures and are lit at runtime by an indoor environment.

## Motion
- Page entrance 260 ms rise 10 px (`route-enter`); scroll reveals 0.7 s rise 24 px (GSAP ScrollTrigger, once).
- Easing tokens: respond (0.2,0.8,0.2,1), glide (0.32,0.72,0,1), exit (0.3,0,0.8,0.15).
- Reduce Motion: no reveals, no camera travel.

## Content rules
- Never invent testimonials, statistics, certifications or customers. Facts used: company name, city, product facts,
  School pricing per child per term (Free, Basic ₦1,000, Advanced ₦3,000) and the founding-school offer, from the owner.
