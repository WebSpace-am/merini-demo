# MERINI — demo website

Concept website for **MERINI Furniture, Yerevan** (Instagram [@merinifurniture.yvn](https://www.instagram.com/merinifurniture.yvn/)).
Premium Italian-style showroom site in **Armenian (default), English and Russian**. Pitch demo — not yet approved by the client.

## Pages

| Page | File |
| --- | --- |
| Home — full-screen slideshow, video manifesto, collections, sofa configurator, showroom | `index.html` |
| Collections — filter by room, sort by price | `collections.html` |
| Product — finishes, sizes, live price, WhatsApp enquiry | `product.html?id=onda` |
| Atelier — story, process, materials library | `atelier.html` |
| Showroom — two locations, hours, booking form (demo, sends nothing) | `showroom.html` |

## Run locally

Plain static HTML/CSS/JS — no build step, no dependencies.

- Open `index.html` directly in a browser, or
- Windows: `powershell -ExecutionPolicy Bypass -File serve.ps1` → http://localhost:5173

## Deploy

Any static host works; publish the repository root as-is:

- **Vercel / Netlify:** import the repo, framework "Other", no build command, output directory `.`
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root

When changing CSS or JS, bump the `?v=` number on the `<link>`/`<script>` tags in the five HTML files so browsers fetch the new files.

## Structure

```
assets/css/styles.css   design tokens (primitive → semantic → component) + all styles
assets/js/data.js       catalogue: products, prices (AMD), finishes, contacts
assets/js/i18n.js       UI copy in hy / en / ru
assets/js/main.js       header, footer, menu, language switch, floating contact button
assets/js/pages.js      page logic (slideshow, configurator, filters, product, forms)
assets/*.jpg            product photos cropped from MERINI's Instagram (640px — replace with originals)
assets/hero, stock      placeholder photography (Unsplash License)
assets/video            manifesto background film (Pexels License)
```

## Content notes before going live

- Prices, product names (Onda, Terra, Grigio…), lead times and service claims are **demo values** — confirm with MERINI. Only the 245,000 ֏ sofa price is from their Instagram.
- Replace Instagram crops and stock photos with MERINI's original high-resolution shoots.
- Confirm the WhatsApp number (+374 99 575111) and the Garage Masters Mall address.
- Connect the booking form to a real endpoint (it currently shows a success message only).

## Credits

- Hero, story, kitchen photos: [Unsplash](https://unsplash.com/license) (free to use).
- Manifesto video: [Pexels #10135156](https://www.pexels.com/video/modern-minimalist-living-room-10135156/) (free to use).
- Font: Google Sans (Google Fonts).
