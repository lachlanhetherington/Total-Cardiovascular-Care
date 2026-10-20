# Total Cardiovascular Care: redesign preview

Static concept site for client review, hosted on Vercel. Light redesign of totalcardiovascularcare.com.au, to be rebuilt later in WordPress (Elementor + Blocksy).

## Pages
| Page | Path |
|---|---|
| Home | `/` |
| Doctor profile (13, one template) | `/doctors/justin-cole` etc. |
| Service | `/services/coronary-angioplasty` |
| Location (7, one template) | `/locations/frankston` etc. |

## Editing
Source lives in `src/`. `data.json` holds doctors and clinics; `site.css` and `site.js` are shared; `home.html` and `service-coronary-angioplasty.html` are page bodies; `img/` holds images. Then rebuild:

```
python build.py
```

This regenerates `site/`, which is what Vercel serves (see `vercel.json`). Commit `site/` along with your changes.

## Deploy
Import this repo in Vercel and leave the defaults. `vercel.json` sets the output directory to `site` and turns on clean URLs. Pages carry `noindex` so the preview stays out of search results.
