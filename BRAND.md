# Total Cardiovascular Care: brand tokens

Source: live site Elementor kit (post-6.css), extracted 2026-10-20.

## Original brand (current site)
| Token | Value | Use |
|---|---|---|
| Primary | #00A7E9 | Cyan, buttons, heartbeat line |
| Secondary | #F3F9FC | Pale sky backgrounds |
| Text | #39393D | Body copy |
| Accent | #000522 | Navy, headings, header/footer |
| Light | #FBFBFE | Page background |
| Grey | #DADADA | Borders |
| Type | Helvetica (700 headings, 400 body) | Pill buttons, radius 100px |

## Redesign system (preview/index.html)
- Light-first: navy reserved for type, preview bar and footer (client feedback: hero too dark).
- Cyan buttons use navy text (7:1 contrast); cyan text on light grounds uses #0072A3.
- Type: Geist 300/400/500 (display + body), Geist Mono (labels, credentials, hours, postcodes).
- Radii: 28px photo plates, 22px cards, pill buttons.
- Logo: img/tcc-logo-navy.webp (generated from white logo for light header), img/tcc-logo.webp on navy.

## WordPress port plan (Elementor + Blocksy free)
- Blocksy Customizer: palette slots = the 6 colours above + #E4F2FA, #DCE5EB, #5F6873; Geist via Google Fonts.
- Elementor Site Settings > Global colours/fonts mirror the same tokens.
- Existing CPT `doctor` (13 entries) -> Elementor single template (doctor view).
- New CPT `location` (7 entries: address, venue, lat/lon, hours, photo) -> single template.
- Service pages as child pages of /services/ using one template (angioplasty = pilot).
