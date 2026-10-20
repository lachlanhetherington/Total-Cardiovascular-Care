# Total Cardiovascular Care: redesign preview

Static concept site for client review, hosted on Vercel. Light redesign of totalcardiovascularcare.com.au, to be rebuilt later in WordPress (Elementor + Blocksy).

## Pages
| Page | Path |
|---|---|
| Home | `/` |
| Doctors (all 13, filterable) | `/doctors` |
| Doctor profile (one template) | `/doctors/justin-cole` etc. |
| Services (6 areas of care) | `/services` |
| Area of care (6, generated) | `/services/general-cardiology`, `/services/rhythm-management` etc. |
| Service guide | `/services/coronary-angioplasty` |
| Locations (map + 7 clinics) | `/locations` |
| Location (one template) | `/locations/frankston` etc. |
| Referrers | `/referrers` |
| About (approach + support team) | `/about` |
| Contact (with message form) | `/contact` |
| Request an appointment (3-step form) | `/appointment` |

Every nav item opens a mega menu on desktop, built from the same data.

## Editing
Source lives in `src/`. `data.json` holds doctors, clinics and support staff; `pages/` holds the index page bodies; `contact.html` is the shared contact section; `procedures.json` holds every procedure's content (from the live site) used to generate the area pages; `site.css` and `site.js` are shared; `home.html` and `service-coronary-angioplasty.html` are page bodies; `img/` holds images. Then rebuild:

```
python build.py
```

This regenerates `site/`, which is what Vercel serves (see `vercel.json`). Commit `site/` along with your changes.

## Forms
The appointment and contact forms validate entries and show a confirmation, but send nothing: this preview has no server, and the forms ask for health details and Medicare numbers. On the live WordPress build, connect them to a form plugin or the practice's booking system.

## Deploy
Import this repo in Vercel and leave the defaults. `vercel.json` sets the output directory to `site` and turns on clean URLs. Pages carry `noindex` so the preview stays out of search results.
