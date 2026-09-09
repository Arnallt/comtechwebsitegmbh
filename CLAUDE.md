# ComTech GmbH — website

Marketing site for a Swiss tokenisation **technology** company. Read this whole file before writing code. The rules in §2, §5 and §9 are not style preferences; breaking them breaks the client's regulatory position or their brand strategy.

---

## 1. What this company is

ComTech GmbH supplies tokenisation infrastructure to issuers, banks, asset managers and asset owners. Three business pillars:

| Pillar | One line | Who operates the infrastructure |
|---|---|---|
| **Platform** | Ready-to-use platform for bringing real-world assets on-chain | ComTech |
| **Technology** | Enterprise components institutions integrate into their own stack | The client |
| **Precious Metals** | Specialised vertical proving the technology on a physical asset | Either |

Underneath all three: **One Infrastructure. Multiple Assets. Multiple Applications.**

The company is repositioning away from being seen as a gold-token company. Source strategy: *"ComTech should increasingly be viewed alongside financial infrastructure and enterprise technology providers, rather than simply alongside cryptocurrency or token issuers."*

---

## 2. Hard guardrails — read twice

### 2.1 Entity separation
ComTech GmbH (Swiss, technology) is **not** the Dubai gold-token issuer, though they share ownership. The GmbH does not issue, hold, custody, trade or redeem anything. It supplies technology that executes instructions given by others.

- Always write **ComTech GmbH** on first use per page and in the footer. Unqualified "ComTech" blurs the two entities.
- ComTech is the subject of *technology* verbs only: configures, deploys, executes, records, integrates.
- ComTech is never the subject of *asset* verbs: tokenises gold, holds, custodies, redeems, issues, sells.

### 2.2 Never put these on the site
From §13 of the source strategy, plus extensions:

- "FINMA Licensed", "FINMA Approved", FINMA's name or mark in any credential position
- "Buy tokenised securities through ComTech", "Invest through ComTech", "Trade tokenised assets", "ComTech custody", "ComTech investment platform"
- Any claim that a physical redemption has been executed. The source describes redemption only as a *lifecycle stage the technology supports*.
- Silver, platinum or palladium as current capability (gold only, and even that as technology experience)
- Fee, pricing or revenue-model content of any kind
- "ComTech 1.0 / 2.0 / 3.0" as public-facing narrative
- Partner categories without named partners; "multi-chain" without naming chains; "institutional-grade" without a named audit

### 2.3 Never invent a fact
If copy needs a number, a client name, a chain, an audit firm, a date or a partner, **do not make one up and do not write a plausible placeholder that reads as real**. Emit:

```
{{TK: what is needed}}
```

`npm run check:tk` fails the build if any `{{TK:` survives into a production build. This is intentional. There are ~16 unresolved facts on this project.

---

## 3. Design direction — "the systems manual"

Engineering line-art diagrams set in Swiss financial-document typography. Nothing is rendered, shaded or simulated. Everything is stroke, type and rule.

**Source instruction that governs everything:** *"The website should not feel like a cryptocurrency website. It should look much closer to an institutional financial infrastructure / enterprise technology company."*

### Banned outright
- Drop shadows, elevation systems, glassmorphism, blur backdrops
- Gradients of any kind, including subtle ones
- `border-radius` above `1px`
- Cards with hover-lift
- Glowing nodes, particle fields, hex lattices, animated network graphs
- Stock photography of any kind. **The site has no photography at all** (see §8)
- Icon libraries. The diagram system is the only illustration
- WebGL / three.js / shader effects. Explicitly rejected: `ruucm/shadergradient`, `paper-design/liquid-logo`, `dashersw/liquid-glass-js`, `pmndrs/react-three-fiber`. A rendered-gold treatment reverses the entire repositioning.

---

## 4. Design tokens

Define once in `src/styles/tokens.css` as CSS custom properties. Never hardcode a colour or a size anywhere else.

```css
:root {
  --paper:      #F7F7F5;
  --ink:        #16181A;
  --graphite:   #5A5F63;
  --rule:       #D9D8D2;
  --rule-soft:  #E8E7E2;
  --panel:      #FFFFFF;
  --brass:      #8A5E17;
  --brass-tint: #F0E7D4;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper:#141517; --ink:#E9E8E4; --graphite:#9DA1A5;
    --rule:#33363A; --rule-soft:#26282B; --panel:#1B1D1F;
    --brass:#C79A4A; --brass-tint:#2A2318;
  }
}
:root[data-theme="dark"] { /* same overrides as above */ }
```

Also define `--space-1: 4px` through `--space-8: 72px` on the scale **4 / 8 / 12 / 16 / 22 / 34 / 44 / 72**. Nothing outside the scale.

### 4.1 The brass rule — the most important rule in this file

> **`--brass` marks the ComTech technology layer inside diagrams. Nothing else, anywhere, ever.**

Not buttons. Not links. Not headings. Not hover states. Not focus rings. Not backgrounds. Not the logo.

It appears in exactly three places: the eight system diagrams, the scope-of-service block's left edge, and the regulatory page. Its whole purpose is that a visitor learns within seconds which parts of the financial chain ComTech is responsible for — which is what §5 of the source strategy explicitly asks for: *"ComTech clearly identifiable as the technology infrastructure layer rather than automatically suggesting that ComTech performs every financial-market function."*

Buttons and links are `--ink` with an underline offset. Focus rings are `2px solid var(--ink)` with `2px` offset.

### 4.2 Type

Two families, self-hosted via Fontsource. No Google Fonts CDN (security-review finding for a bank-facing site, and it complicates the CSP).

- **Reading:** Spectral 300 / 400 / 600 + italic — all body copy
- **Structure:** Archivo 400 / 500 / 600 — headings, nav, labels, table heads, diagram labels, captions, buttons

| Step | Size / line-height | Use |
|---|---|---|
| display | `clamp(30px, 5.2vw, 46px)` / 1.08 | Page H1, Archivo 600, `-0.02em` |
| h2 | 24px / 1.2 | Section heads, Archivo 600, `-0.01em` |
| h3 | 16px / 1.3 | Subsections, Archivo 600 |
| lead | 20px / 1.55 | One standfirst per page maximum |
| body | 17px / 1.66 | Spectral 300, measure capped at `68ch` |
| small | 15px / 1.5 | Tables, captions, footnotes |
| label | 12.5px / 1.4 | Archivo 600. **Never all-caps with wide tracking** |

`font-variant-numeric: tabular-nums` on every table, diagram label and figure. Non-negotiable.

### 4.3 Layout

- Container max `960px`, gutter `24px`, measure `68ch`
- Left margin rail `120px` above `900px`, carrying section numerals and (on sequence pages only) the stage rail
- Breakpoints: `640` single column / `900` margin rail on / `1024` diagrams go horizontal
- Dense. No full-viewport sections, no 200px padding between ideas. Institutional readers prefer more per screen.
- Hierarchy comes from rule weight, type size and whitespace. There is no card component.

---

## 5. The diagram system

The source document requests **eight** diagrams. They are the site's primary content, not decoration. Build them as one system or they will drift.

All eight reduce to one primitive — a labelled node with an ownership state — in five arrangements.

| # | Diagram | Arrangement | Nodes (verbatim from source) |
|---|---|---|---|
| 1 | Platform lifecycle | Chain | Asset onboarding → Structuring → Token configuration → Smart contract deployment → Minting → Registry → Corporate actions → Reporting → Redemption/Burning |
| 2 | Metals chain | Chain | Physical Metal → Vault/Custodian → Verification → Tokenisation → Digital Token → Transfer / Integration / Redemption |
| 3 | API stack | Stack | Client Systems ↓ ComTech APIs ↓ Tokenisation Engine ↓ Smart Contracts ↓ Blockchain / DLT ↓ Custodian, Banking, Registry, Other Partners |
| 4 | Engagement | Sequence | 01 Discover · 02 Design · 03 Build · 04 Deploy · 05 Manage |
| 5 | Ecosystem | Hub | Issuers, Banks, Custodians, Vaults, KYC/AML, Legal, Auditors, DLT Networks, Trading Venues, Payment Providers, Asset Managers |
| 6 | Pillar logic | Progression | Use our platform → Integrate our technology → Deploy specialised asset solutions |
| 7 | Perception shift | Progression | Current: ComTech → CGO → Gold Token → Crypto. Target: ComTech → Swiss Technology Company → Tokenisation Infrastructure → Real-World Assets → Institutional Digital Assets |
| 8 | Brand architecture | Progression | COMTECH / PLATFORM · TECHNOLOGY · PRECIOUS METALS |

Diagram 2 is diagram 1 at lower resolution. **Same component, fewer nodes.** Do not author them separately.

### 5.1 Drawing rules

- Hand-authored inline SVG in `src/components/diagrams/`. No charting library, no icon font, no image files.
- Colour via `currentColor` so tokens and dark mode work automatically
- **Stroke weights, three only:** `1px` third-party node · `1.6px` ComTech node · `2.2px` emphasis. Connectors `1px` at `0.5` opacity.
- **No fills.** Line art only. Depth from stroke weight, never tone or shadow.
- Labels are real `<text>` in Archivo — selectable, translatable, indexable. Never convert text to paths.
- Every diagram: `role="img"` plus an `aria-label` describing the whole sequence in prose
- Meaning must survive with colour removed. That is why stroke weight, not brass alone, distinguishes ComTech nodes.
- Horizontal ≥1024px, vertical stack below. A nine-node horizontal chain on a 390px viewport is unreadable.

### 5.2 Ecosystem hub constraint
Eleven unnamed categories reads as *dependence*, not orchestration. Either name real partners (`{{TK: which partners may be named}}`) or reduce to the four or five that genuinely sit adjacent to the technology layer, presented as an interface list rather than a constellation.

---

## 6. Components

### 6.1 `ScopeOfService.astro` — the most important component
Identical on every capability page, at the end of the capability section, before the CTA. Body width, `1px solid var(--rule)`, `3px` brass left edge, `--panel` background, full-contrast text. **Not grey, not small, not a footnote.**

Three short paragraphs max: what ComTech performs · who instructs · what ComTech does not perform.

The source strategy specifies this wording, which is legally load-bearing:

> "Minting and burning executed technologically pursuant to authorised issuer instructions."

Final text is `{{TK: perimeter statement from counsel}}`.

### 6.2 `StageRail.astro`
Only on `/platform` and `/precious-metals`, the two pages with a genuine sequence. Narrow rail in the left margin above `900px`, chain rendered vertically, active node advances on scroll, brass segment grows across ComTech's nodes. Off below `900px`, off on every other page.

Scrollama + `position: sticky`. **No scroll-jacking, no pinning, no wheel hijacking.** The page scrolls normally; the rail follows.

### 6.3 `PillarComparison.astro`
One shared component rendering the Platform / Technology / Precious Metals distinction, used identically on Home, Platform and Technology. One source of truth. The source strategy admits Pillar 2 *"should be differentiated from the Platform business"* — the distinguishing question, asked the same way everywhere, is **who operates the infrastructure**.

### 6.4 Production vs roadmap
Every capability page splits capabilities under two visible headings: **In production** and **Roadmap**. Same type treatment, no visual softening. The source runs them together, which is why a reader finishes it unable to name one thing the company does today.

---

## 7. Motion

**Two moments. Nothing else animates.**

1. **Diagram draw** — first view only, connectors draw in sequence, brass segment last. Under `600ms`, linear-out. GSAP DrawSVG.
2. **Stage rail advance** — active node state change on scroll. A state change, not a transition effect.

Banned: scroll-triggered fade-and-slide on section entry, hover transforms, parallax, animated counters, page transitions. These are the generic default and read as templated.

`prefers-reduced-motion: reduce` disables both and shows every diagram complete.

Treat native CSS scroll-driven animations (`animation-timeline`) as **enhancement only**. Firefox does not ship it, and its failure mode is nasty: an unsupporting browser drops that one declaration and keeps the rest of the rule, so a scroll effect fires all at once on load. Guard behind `@supports (animation-timeline: view())` or just use GSAP.

---

## 8. Imagery

**There is none.** No photography, no stock, no illustration beyond the diagram system, no icon set, no client logo wall.

This is deliberate. ComTech GmbH has no physical operation to photograph, and stock imagery of vaults, bullion or trading floors would imply custody and market functions the company does not perform — the precise risk §13 of the source strategy exists to prevent.

Consequence: diagrams and typography carry the entire visual load. Quality bar on both is high.

---

## 9. Copy rules — enforced in CI by Vale

The source strategy hedges nearly every capability sentence. Hedged capability language does not read as caution; it reads as a company unsure of itself.

1. **No hedges in capability copy.** Banned: `could`, `potentially`, `where appropriate`, `where legally permissible`, `subject to applicable requirements`, `within the activities permitted to`. If a sentence needs one, state the fact or delete the sentence. The perimeter lives in the scope block, once, confidently.
2. **Present tense for production.** Roadmap goes under its own heading. No conditional or future tense in product copy.
3. **No category nouns where a name is possible.** "Custodians" → the named custodian. "Appropriate DLT networks" → the named chains.
4. **Name token standards.** ERC-3643, ERC-1400, or restricted-transfer ERC-20. An integrating engineer looks for these to establish that permissioned transfer and forced transfer are solved.
5. **British spelling.** `tokenisation`, never `tokenization` — including slugs, metadata and alt text.

### Lexicon
| Use | Never |
|---|---|
| ComTech GmbH (first use, footer) | ComTech, unqualified |
| tokenisation | tokenization |
| Platform / Technology (by who operates) | used interchangeably |
| Precious Metals | Gold & Precious Metals |
| issuer (always a third party) | we, us, our token |
| client | customer, user |
| institutional (adjective only) | Institutional as a nav label |

### Copy from the source to use rather than invent
- Central: **Infrastructure for the Tokenised Economy**
- Support: *"We provide the technology and infrastructure that enable businesses, asset owners and financial institutions to transform real-world assets into programmable digital assets."*
- Pillar 1: **Bring Your Assets On-Chain** / **From Asset to Token** / **Tokenisation Infrastructure as a Service**
- Pillar 2: **Your Brand. Your Clients. Our Technology.** / **Build Rather Than Outsource Your Digital Asset Business**
- Pillar 3: **Bringing Physical Value On-Chain** / **Precious Metals Digital Infrastructure**
- Technology page: **Institutional Technology for Real-World Assets**
- TaaS: **From concept to digital asset infrastructure.**
- Lockup line: **One Infrastructure. Multiple Assets. Multiple Applications.**

**Open decision, do not resolve alone:** the source hero is *"Infrastructure for the Tokenised Economy"*, which every competitor could also claim (Taurus, Tokeny, Securitize, Sygnum, Fireblocks). An alternative that differentiates and states the regulatory perimeter in one line is *"We don't issue tokens. We build the infrastructure that does."* Build with the source line; leave the alternative as a commented variant in `src/content/home.md` for the client to choose.

---

## 10. Architecture

```
/                              Home
/platform                      Pillar 1
/technology                    Pillar 2
  /technology/apis
  /technology/smart-contracts
  /technology/white-label
/precious-metals               Pillar 3 (no children)
/solutions                     Audience hub
  /solutions/banks
  /solutions/asset-managers
  /solutions/corporates
  /solutions/fintech
/developers                    Thin entry → docs subdomain
/company/about
/company/regulatory-approach
/company/contact
```

Top nav, six items plus one action:
`Platform · Technology · Precious Metals · Solutions · Developers · Company [Request access]`

Notes on why this differs from the source's §14:
- Source proposes 10 pages in §2 and an 8-item bar in §14; they don't match. Reconciled here.
- Source places Precious Metals in the top bar **and** under Solutions. Duplicate path removed — it appears once.
- Source gives Regulatory a top-level slot while §13 establishes there's almost nothing affirmative it can say. Top placement draws attention to the weakest page and implies a licence exists. Moved under Company.
- Source's Technology dropdown has six children; three is enough, each substantial, each routing to `/developers`.

---

## 11. Stack

| Layer | Package | Repo |
|---|---|---|
| Framework | `astro` | https://github.com/withastro/astro |
| MDX / sitemap | `@astrojs/mdx`, `@astrojs/sitemap` | (same org) |
| Sequence | `scrollama` | https://github.com/russellsamora/scrollama |
| Draw animation | `gsap` (incl. DrawSVG) | https://github.com/greensock/GSAP |
| Fonts | `@fontsource-variable/spectral`, `@fontsource-variable/archivo` | https://github.com/fontsource/font-files |
| Search | `pagefind` | https://github.com/CloudCannon/pagefind |
| Prose lint | `vale` | https://github.com/errata-ai/vale · styles: https://github.com/errata-ai/styles |
| A11y tests | `@axe-core/playwright` | https://github.com/dequelabs/axe-core · https://github.com/microsoft/playwright |
| Perf CI | `@lhci/cli` | https://github.com/GoogleChrome/lighthouse-ci |
| CMS (optional) | `@keystatic/astro` | https://github.com/Thinkmill/keystatic |
| Docs site (if built) | `@astrojs/starlight` | https://github.com/withastro/starlight |
| API reference | `@scalar/api-reference` **or** `@stoplight/elements` | https://github.com/scalar/scalar · https://github.com/stoplightio/elements |
| SDA polyfill (only if needed) | `scroll-timeline-polyfill` | https://github.com/flackr/scroll-timeline |

GSAP is free for commercial use including formerly paid plugins as of April 2025 — no licence purchase needed. Confirm Astro's current major version at kickoff; it has moved recently.

**Do not add** any dependency not listed here without asking. Especially: no Tailwind play CDN, no React (this site needs none), no animation library beyond GSAP, no UI kit, no analytics SDK from a third party.

### Commands
```
npm run dev          # local
npm run build        # static output
npm run check:tk     # fails if {{TK: survives
npm run lint:prose   # vale
npm run test:a11y    # playwright + axe
npm run lhci         # lighthouse budgets
```

---

## 12. Non-negotiable quality gates

- **WCAG 2.2 AA** as a build requirement, not a review note. Institutional procurement asks about this directly.
- Site renders and reads correctly **with JavaScript disabled**. Rail and draw animation are enhancements.
- **Print stylesheet.** Procurement circulates pages as PDFs; the site must print as a clean document with diagrams intact.
- Self-hosted fonts, self-hosted privacy-first analytics, no third-party beacons.
- Budgets: LCP < 1.5s on 4G, CLS 0, total JS < 40KB on pages without the rail.
- Strict CSP. No inline scripts without a nonce.

---

## 13. How to work in this repo

1. Build `/precious-metals` and `/platform` first. They exercise the diagram system and the stage rail, which are the two hardest things here. Everything else is easier once they exist.
2. Build the diagram system before any page that uses it. `src/components/diagrams/Node.astro`, `Chain.astro`, `Stack.astro`, `Hub.astro`, `Sequence.astro`, `Progression.astro`.
3. Content lives in `src/content/` as MDX with a Zod schema. Copy changes repeatedly through legal review — do not hardcode prose in components.
4. When copy needs a fact you don't have, emit `{{TK: ...}}`. Do not guess. Do not write realistic-looking placeholder numbers.
5. When a design decision isn't covered here, choose the more restrained option and leave a comment. This site has no ornament budget.

### If you find yourself about to
- add a shadow, a gradient, or a rounded card → **stop**, re-read §3
- use brass for a button or a link → **stop**, re-read §4.1
- write "ComTech tokenises gold" → **stop**, re-read §2.1
- invent a client name, a chain, a number or an audit firm → **stop**, emit `{{TK:}}`
- add a hero image or an icon set → **stop**, re-read §8
