"""Build the static Total Cardiovascular Care preview into ./site.

Usage: python build.py
Edit src/ (data.json, site.css, site.js, page fragments), then rebuild.
"""
import html
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "site"
APPT = "https://totalcardiovascularcare.com.au/appointment/"

data = json.loads((SRC / "data.json").read_text(encoding="utf-8"))
DOCS, LOCS = data["doctors"], data["locations"]


def head(title, desc, r):
    return f"""<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="{r}assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="{r}assets/css/site.css">
</head>
"""


def header(r, home):
    a = (lambda x: f"#{x}") if home else (lambda x: f"{r}index.html#{x}")
    return f"""<header class="site-head" id="top">
  <div class="wrap">
    <a class="logo" href="{r}index.html" aria-label="Total Cardiovascular Care home"><img class="logo-dark" src="{r}assets/img/tcc-logo-navy.webp" alt="Total Cardiovascular Care" width="123" height="54"><img class="logo-light" src="{r}assets/img/tcc-logo.webp" alt="" width="123" height="54"></a>
    <nav class="nav" aria-label="Main">
      <a href="{a('doctors')}">Doctors</a>
      <a href="{a('care')}">Services</a>
      <a href="{a('locations')}">Locations</a>
      <a href="{a('referrers')}">Referrers</a>
      <a href="https://totalcardiovascularcare.com.au/about/" target="_blank" rel="noopener">About</a>
      <a href="{a('contact')}">Contact</a>
    </nav>
    <a class="head-phone" href="tel:0390706116" aria-label="Call 03 9070 6116"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>03 9070 6116</a>
    <a class="btn btn--sm" href="{APPT}" target="_blank" rel="noopener">Request appointment</a>
    <button class="menu-btn" type="button" id="menuBtn" aria-expanded="false">Menu</button>
  </div>
</header>
"""


def footer(r, home):
    a = (lambda x: f"#{x}") if home else (lambda x: f"{r}index.html#{x}")
    return f"""<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="about">
        <a class="logo" href="{r}index.html"><img src="{r}assets/img/tcc-logo.webp" alt="Total Cardiovascular Care" width="132" height="58"></a>
        <p>A comprehensive cardiology practice dedicated to helping patients achieve optimal heart health.</p>
        <a class="btn" style="justify-self:start" href="{APPT}" target="_blank" rel="noopener">Request an appointment</a>
      </div>
      <div><h4>Care</h4><ul id="footCare"></ul></div>
      <div><h4>Practice</h4><ul>
        <li><a href="{a('doctors')}">Doctors</a></li><li><a href="{a('locations')}">Locations</a></li><li><a href="https://totalcardiovascularcare.com.au/our-team/" target="_blank" rel="noopener">Our team</a></li><li><a href="https://totalcardiovascularcare.com.au/faqs/" target="_blank" rel="noopener">FAQs</a></li><li><a href="{a('referrers')}">Referring doctors</a></li></ul></div>
      <div><h4>Get in touch</h4><ul>
        <li>11 Hastings Road<br>Frankston VIC 3199</li>
        <li><a href="tel:0390706116" style="white-space:nowrap">03 9070 6116</a></li>
        <li style="overflow-wrap:anywhere"><a href="mailto:reception@totalcardiovascularcare.com.au">reception@totalcardiovascularcare.com.au</a></li></ul></div>
    </div>
    <div class="foot-base">
      <span class="emerg">In an emergency, call <b>000</b></span>
      <span>&copy; Total Cardiovascular Care · <a href="https://totalcardiovascularcare.com.au/privacy-policy/" target="_blank" rel="noopener">Privacy</a> · <a href="https://totalcardiovascularcare.com.au/website-disclaimer/" target="_blank" rel="noopener">Disclaimer</a></span>
    </div>
  </div>
</footer>
<script src="{r}assets/js/data.js"></script>
<script src="{r}assets/js/geo.js"></script>
<script src="{r}assets/js/site.js"></script>
</body>
</html>
"""


def page(path, title, desc, kind, body, slug=""):
    depth = len(Path(path).parts) - 1
    r = "../" * depth
    home = kind == "home"
    doc = (
        head(title, desc, r)
        + f'<body data-page="{kind}" data-root="{r}"' + (f' data-slug="{slug}"' if slug else "") + ">\n"
        + header(r, home)
        + "<main>\n" + body.replace("{R}", r) + "</main>\n"
        + footer(r, home)
    )
    out = OUT / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding="utf-8")
    return path


def build():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "assets/css").mkdir(parents=True)
    (OUT / "assets/js").mkdir(parents=True)
    shutil.copytree(SRC / "img", OUT / "assets/img")
    shutil.copy(SRC / "site.css", OUT / "assets/css/site.css")
    shutil.copy(SRC / "site.js", OUT / "assets/js/site.js")
    shutil.copy(SRC / "geo.js", OUT / "assets/js/geo.js")
    (OUT / "assets/js/data.js").write_text(
        "window.TCC_DOCS=" + json.dumps(DOCS, ensure_ascii=False)
        + ";\nwindow.TCC_LOCS=" + json.dumps(LOCS, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )

    built = [page(
        "index.html",
        "Total Cardiovascular Care | Cardiologists in Melbourne, Mornington Peninsula & Bass Coast",
        "Thirteen specialists and seven clinics across Melbourne, the Mornington Peninsula and the Bass Coast.",
        "home",
        (SRC / "home.html").read_text(encoding="utf-8"),
    )]
    built.append(page(
        "services/coronary-angioplasty.html",
        "Coronary angioplasty & stents | Total Cardiovascular Care",
        "What coronary angioplasty and stenting involve: why it's done, risks, preparation, the procedure and recovery.",
        "service",
        (SRC / "service-coronary-angioplasty.html").read_text(encoding="utf-8"),
    ))
    for d in DOCS:
        built.append(page(
            f"doctors/{d['s']}.html",
            f"{d['n']} | {d['t'][0].upper() + d['t'][1:]} | Total Cardiovascular Care",
            d["b"],
            "doctor",
            '<div class="wrap" id="doctorRoot"></div>\n',
            d["s"],
        ))
    for l in LOCS:
        built.append(page(
            f"locations/{l['s']}.html",
            f"{l['n']} cardiology clinic | Total Cardiovascular Care",
            f"Total Cardiovascular Care {l['n']}: {l['v']}, {l['a']}, {l['sub']}.",
            "location",
            '<div class="wrap" id="locationRoot"></div>\n',
            l["s"],
        ))
    print(f"Built {len(built)} pages into {OUT}")


if __name__ == "__main__":
    build()
