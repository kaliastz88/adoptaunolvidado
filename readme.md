# Adopta un Olvidado — Design System

**Adopta un Olvidado** is a Mexican dog-rescue nonprofit founded by four friends. It rescues, rehabilitates, and carefully matches dogs found abandoned or mistreated in the street with responsible families — it does not run a physical shelter. This design system supports a single product: **the organization's marketing/adoption website** (home, adoption catalog, dog profiles, our story, allies, FAQ, donate/sponsor).

## Sources
- `uploads/pagina-web-adopta.docx` — the founder's own notes: navigation wishlist, ready-to-use copy (Nuestra Historia, Preguntas Frecuentes, Aliados), reference screenshots from other sites she likes, and links (Google Form, Instagram reels). Extracted text lives in `uploads/extracted_text.txt`; the reference screenshots she pasted are in `assets/reference/` (see "Reference material" below — these are NOT this brand's own assets).
- No codebase, no Figma file, and **no logo file** were provided.

## Brand assets — what we have and don't
- **Logo:** the real mark was supplied (`assets/logo/adopta-un-olvidado-logo.png`) — a navy circle with a gold howling dog and stars, ringed by a magenta→orange→gold gradient. Used in the header/footer of the UI kit and `guidelines/brand-wordmark.card.html`. The gradient ring is decorative (logo badge only) — not a general UI gradient.
- **Colors are anchored to the logo**, not invented: primary navy (`--blue-600: #021C4B`) and sponsor gold (`--amber-500: #FEBC1A`) are the exact hex values sampled from the logo; every tint/shade is generated from them via `color-mix()`. Terracotta (CTA) and sage (success) remain original, chosen to complement the logo per the brief's warm/hopeful direction.
- **Fonts are still a Google Fonts substitution** — no brand typeface file exists yet, flagged below.
- **Photography is placeholder.** Every dog photo slot in the UI kit is an icon/gradient placeholder — the org's own editorial dog photography needs to be dropped in.

## Reference material (`assets/reference/`)
Screenshots the founder pasted into her notes, from sites she admires — **not this brand's own visuals**, kept only as inspiration reference, never copied pixel-for-pixel:
- `adoptanocompres-*.png`, `donar-button-reference.png`, `adoptanocompres-instagram-strip.png` — from adoptanocompres.org (Colombia): liked the donation pop-up (once/monthly toggle) and the Instagram reels strip.
- `spanish-site-dog-profile.png`, `spanish-site-cta-banner.png` — a Spanish adoption site: liked the icon-led fact row (species/sex/age/size) and the dog-profile layout.
- `impact-stat-reference.png` — liked surfacing a running adoption count ("+X adopted") — realized here as `StatCounter` with the org's real figure, "+60".
- `faq-icons-reference.png` — Petfinder-style FAQ layout — liked how organized/clean it reads; the founder also cited Petfinder's purple as a reason to keep our own blue subtle rather than heavy.

## Font substitution — please confirm
No font files exist for this brand yet. Nearest Google Fonts matches were chosen for the brief (warm, modern, human, quietly friendly):
- **Sora** — display/headline typeface (loaded via `tokens/typography.css`)
- **Work Sans** — body/UI typeface

**Ask the user:** do these fonts feel right, or is there a preferred typeface to swap in once real brand fonts exist?

## Content fundamentals
- **Language:** Spanish (Mexico), warm and direct — mostly *tú* register ("Dona hoy", "Conoce a nuestros perritos"), first-person-plural voice for the org ("nosotras", "nuestro equipo") since it's run by four founders.
- **Tone:** hope over heartbreak — the brief is explicit that copy should center transformation and second chances, not dwell on suffering. Real example from the source copy: <br>*"En Adopta un Olvidado creemos que rescatar es solo el comienzo; transformar una vida es nuestra verdadera misión."*
- **Dogs are named and addressed with dignity** — profile copy is often written in first-person from the dog's point of view in the founder's references (e.g. "Soy Sienna...").
- **No emoji in body copy**, except the brand's own paw-print (🐾) used as a list-item marker in "Nuestra Historia" — treat 🐾 as the one sanctioned emoji-as-bullet, not general emoji use.
- **Numbers build trust:** lead with the real impact figure, "+60 perritos con hogar" — don't invent additional stats beyond what's confirmed.
- **CTAs are verbs of action and warmth:** "Dona hoy", "Adoptar a [Nombre]", "Apadrinar", "Quiero aliarme como marca" — never generic "Submit"/"Learn more".

## Visual foundations
- **Colors:** blue is the primary/trust color (the brief explicitly asks to keep it light, "no quiero que se sienta tan cargada o pesada" — never a heavy/dark UI). Terracotta is the warm CTA accent (donate/adopt buttons). Amber marks "apadrinar" (sponsorship). Sage marks success/adopted/health states. Neutrals are warm-tinted, never pure gray/black. See `guidelines/colors-*.card.html`.
- **Type:** Sora (display) + Work Sans (body) — generous sizes, tight leading on headlines for a confident, editorial feel.
- **Spacing:** 4px-based scale, generous section padding (`--space-section-pad-y: 6rem`) — the brief calls for "plenty of breathing room."
- **Corner radius:** generously rounded everywhere — pill buttons/tags, 24px cards, 32px modals. This is a deliberate brand signature ("soft rounded elements").
- **Shadows:** soft and warm-tinted (never pure black) — cards sit lightly, they don't sit heavy.
- **Backgrounds:** solid warm off-white/blue-tinted washes and soft two-color gradients behind hero art — no textures, no photographic full-bleed patterns (none were supplied), no hand-drawn illustration style.
- **Motion:** gentle — 220ms standard ease, a bouncy 360ms ease for the signature "tail wag" icon rotation on donate/adopt CTA hover (`Button` `wag` prop), card hover = lift 2–4px + shadow step up. No infinite decorative loops.
- **Hover states:** primary/CTA/sponsor buttons darken one step; secondary/ghost buttons fill with a soft brand tint; cards lift with a shadow step-up — never a flat color swap alone.
- **Press states:** `scale(0.97)`, 140ms — no darker color needed on top of the scale.
- **Borders:** thin (1–1.5px), used sparingly on secondary buttons and inputs; never a colored left-border-accent card treatment.
- **Transparency/blur:** only on the sticky header (frosted, `backdrop-filter: blur(8px)`) and the modal scrim — not used decoratively elsewhere.
- **Imagery tone:** none supplied yet — placeholders are warm-toned gradients (blue↔terracotta, sage↔blue) as a stand-in for the eventual "bright, airy, editorial" photography the brief calls for. Flag to the user: real photography is needed before shipping.
- **Cards:** white surface, 24px radius, soft shadow, no border — hover lifts and deepens the shadow.

## Iconography
No icon codebase/sprite/SVGs were supplied. **Lucide** (CDN, `unpkg.com/lucide`) was substituted — a clean line-icon set matching the brief's "clean, modern, uncluttered" direction and a similar stroke weight to the heart/paw icons referenced in the founder's screenshots. Used at 16–28px, colored with the semantic action/status tokens (never plain black). No emoji-as-icon anywhere in UI chrome. Flag to the user: if the org later commissions custom icons (e.g. a bespoke paw-print mark), swap this substitution out.

## Components (`components/`)
Standard set, sized to this brand's needs (no existing library to match against):
- **Core** — `Button` (primary/cta/sponsor/secondary/ghost, with the wag microinteraction), `Badge` (status pill), `IconButton`
- **Forms** — `Input`, `Select`, `Checkbox`
- **Data** — `DogCard` (catalog card), `StatCounter` (impact numbers)
- **Overlay** — `Tabs` (donation-mode toggle), `Modal` (donation pop-up), `Accordion` (FAQ)

### Intentional additions
None of these components come from a pre-existing library — all 11 are the standard "from scratch" set called for when no source defines an inventory.

## UI Kit (`ui_kits/website/`)
Interactive click-through of the full marketing site (11 screens): **Home**, **Adopta** (filterable catalog), **Dog profile**, **Donar**, **Apadrina**, **Historias de éxito**, **Aliados**, **Voluntario**, **Nuestra Historia**, **Preguntas Frecuentes**, **Contacto**. Open `ui_kits/website/index.html` — navigate via the header or footer.

## Foundations & Brand cards (`guidelines/`)
Color, type, spacing, radius, elevation, wordmark, motion, and iconography specimens — populate the Design System tab.

## Admin CRUD (`ui_kits/website/admin.html`)
Prototype admin panel to add/edit/delete adoptable dogs and cats. Fields: Nombre, Especie (Perro/Gato), Edad, Tamaño, Energía, Estado (Disponible/En proceso/Adoptado), Compatibilidad, Foto (URL), Biografía — same fields discussed for the Wix "Dogs" CMS collection. Data persists to `localStorage` in this prototype only. Linked from the site header via the gear icon.

## Index
- `styles.css` — global stylesheet entry (imports everything under `tokens/`)
- `tokens/` — colors, typography, spacing, radius, shadows/motion
- `components/core|forms|data|overlay/` — 11 React components, each with `.jsx` + `.d.ts` + `.prompt.md` + a card
- `ui_kits/website/` — App shell + 11 screens (Home, Catalogo, DogProfile, Donar, Apadrina, Historias, Aliados, Voluntario, Historia, FAQ, Contacto)
- `guidelines/` — foundation specimen cards
- `assets/reference/` — the founder's pasted reference screenshots (inspiration only, not this brand's own assets)
- `uploads/` — original docx + extracted text/media
- `SKILL.md` — portable skill file for Claude Code

## Caveats & open questions for the user
1. **Fonts are a Google Fonts stand-in** (Sora + Work Sans) — confirm or replace once real brand fonts exist.
2. **All dog photography is placeholder** — the catalog/profile/story sections need real photos to feel "premium nonprofit" rather than a wireframe.
3. Dog names/bios in the UI kit (Sienna, Kiwi, Melón…) are **placeholder demo content** styled after the founder's reference screenshots — not verified as this org's real dogs; replace with real profiles before shipping.
4. Aliados is now a standalone page (featured ally "Hotel PupuClub" + four ways to partner) and also previews on the homepage.
6. **Voluntario page is a placeholder layout** — the brief only confirmed the section title ("¿Quieres ser voluntario?"), no ready copy exists yet. Flagged directly on that page; needs real content before shipping.
7. **Contacto page needs real details** — email, phone, Instagram handle and city are all `[pendiente]` placeholders, flagged on the page.
8. **Historias de éxito uses demo stories** (Valiente, Snow, Dorito, Nona) — only Snow is referenced in the source notes; replace with real rescue stories and photos.
9. **Donation amounts are in COP** copied from the founder's reference screenshot (a Colombian site) — confirm the right currency and tiers for Mexico.
5. The logo's gradient ring is used sparingly (logo badge only) to keep the UI "not heavy" per the brief — flag if you'd like it used more decoratively elsewhere.
