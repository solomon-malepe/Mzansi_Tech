# MzansiTech — website

A static, dependency-free business website for **MzansiTech**, a South African web studio.
No build step, no frameworks: open `index.html` and it runs.

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — hero, services, the story behind the name, process, work, pricing, FAQ |
| `services.html` | Detailed services, what's included, package comparison table, add-ons |
| `portfolio.html` | Filterable project grid + embedded live store demo |
| `about.html` | The name, the founder, values, coverage across the 9 provinces |
| `contact.html` | Quote request form, contact channels, office hours, FAQ |
| `privacy.html` | Privacy policy / POPIA notice |
| `terms.html` | Terms of service |
| `thank-you.html` | Shown after the form is submitted successfully |
| `404.html` | Not-found page |

Supporting files: `styles.css`, `main.js`, `sitemap.xml`, `robots.txt`, `site.webmanifest`,
`netlify.toml`, `assets/`.

---

## Before you go live — the short list

1. **Buy the domain.** Every page currently says `https://www.mzansitech.co.za` in its
   `<link rel="canonical">`, Open Graph tags and `sitemap.xml`. If your real domain differs,
   find-and-replace `www.mzansitech.co.za` across all `.html` files and `sitemap.xml`.
2. **Email is published as `solomonmalepe8@gmail.com`.** It appears in every page footer (a
   `.social-btn` and a "Get in touch" link), as a `.contact-item` card on `contact.html`, in the
   `"email"` field of the structured data on `index.html` and `contact.html`, and in the contact
   sections of `privacy.html` and `terms.html`. To change it, find-and-replace that address
   across all `.html` files.

   Consider moving to a branded address (e.g. `hello@mzansitech.co.za`) once the domain is
   registered — most `.co.za` registrars include mail forwarding, so it can just forward to the
   Gmail inbox. A business address on the business domain reads better on a quote page.

   Social: there is no Instagram link anywhere. If you open an account, add a `.social-btn` to
   each footer and put the profile URL in the `sameAs` array in `index.html`.

   Note the form still delivers to whatever inbox your Formspree endpoint is configured for —
   that is backend config, separate from the address published on the page.
3. **Check the Formspree form.** `contact.html` posts to `https://formspree.io/f/xlgdoonw`.
   Confirm that form is still active and pointed at the inbox you actually read.
4. **Add testimonials when you have them.** `index.html` has a commented-out testimonial block
   (search for `TESTIMONIALS`). Delete the comment wrapper and fill in real quotes — nothing on
   the site invents reviews you haven't received.

---

## Things worth knowing

**Theme.** Dark by default. The toggle in the header stores the choice under the
`mzansitech-theme` key in `localStorage`. All colours come from CSS custom properties at the
top of `styles.css` — change `--gold-500`, `--green-500` and the `--bg`/`--surface` scale and
the whole site follows.

**The form.** Submits by `fetch` and redirects to `thank-you.html` on success. If JavaScript is
off, the browser posts the form normally and Formspree shows its own confirmation. A hidden
`_gotcha` honeypot field catches bots. Nothing else is needed server-side.

**Package links.** `contact.html?package=pro` pre-selects that package in the form. The pricing
buttons already use this (`basic`, `pro`, `biz`, `store`).

**Numbers that animate.** Any element with `data-count="24"` counts up when scrolled into view;
`data-prefix` and `data-suffix` wrap it. They respect `prefers-reduced-motion`.

**Analytics is wired but switched off.** Every page has a commented-out Cloudflare Web
Analytics snippet just above `</body>`. It is free, cookieless and needs no consent banner.
To switch it on: sign up at dash.cloudflare.com, open Web Analytics, add your domain, copy the
site token, replace `YOUR_TOKEN_HERE` and delete the comment wrapper — on all 9 pages. If you
enable it, add a line to `privacy.html` saying you use Cloudflare Web Analytics, which collects
no cookies and no personal information.

**The embedded demo loads on click.** The portfolio page no longer pulls the external demo site
on page load. Visitors see a poster and tap to load it, which keeps roughly a megabyte of
third-party content off the page for everyone who never opens it.

**Mobile.** Breakpoints at 1080 / 960 / 820 / 680 / 400 / 340px, plus a landscape-phone rule.
Form inputs are 16px (anything smaller makes iOS zoom on focus), tap targets are 44px and up on
touch, fixed buttons clear the notch and home indicator via `env(safe-area-inset-*)`, and
`@media (hover: none)` stops hover states sticking after a tap.

**Portfolio filters.** Each card carries `data-category="ecommerce|business|landing|profile"`.
To add a project, copy a `.work-card` block and give it a category — the filter buttons pick it
up automatically.

**Claims kept honest.** Everything stated on the site is either verifiable from your own package
terms (R2,500 / R5,500 / R9,500, stores from R14,500, 12 months hosting, R650/year
renewal, 50% deposit) or a
commitment you control (24-hour replies, 9 provinces, office hours). There are no invented
client counts, years in business or review quotes. Keep it that way as you edit.

---

## Deploying

Any static host works. On **Netlify**, drag the folder onto the dashboard or connect the repo —
`netlify.toml` is already set up with security headers and asset caching, and Netlify serves
`404.html` automatically.

After launch: submit `sitemap.xml` in Google Search Console and create a Google Business Profile
(that pairing is what makes local searches find you).

---

## Brand assets

| File | Use |
|---|---|
| `assets/logo-mark.svg` | Square icon used in the header and footer |
| `assets/logo.svg` | Full horizontal lockup — invoices, letterheads, email signatures |
| `assets/favicon.svg`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png` | Browser tabs, PWA icons |
| `assets/apple-touch-icon.png` | iOS home-screen icon |
| `assets/og-image.png` | The preview card shown when a link is shared on WhatsApp, Facebook or LinkedIn |

Brand colours: gold `#f5a524`, green `#0fa968`, sky `#38bdf8`, ink `#070b14`.
Fonts: **Sora** (headings) and **Inter** (body), **self-hosted** from `assets/fonts/`
(latin subset, ~72 KB total). Nothing is fetched from Google, so there is no third-party
font request to disclose and no render-blocking stylesheet.

`ZESTYWEB-LOGO.png` in the project root is the old logo. Nothing references it any more — keep
it for your records or delete it.
