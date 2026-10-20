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
      <div class="nav-item" data-mega="doctors"><a class="nav-link" href="{r}doctors.html">Doctors<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></a><div class="mega"></div></div>
      <div class="nav-item" data-mega="services"><a class="nav-link" href="{r}services.html">Services<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></a><div class="mega"></div></div>
      <div class="nav-item" data-mega="locations"><a class="nav-link" href="{r}locations.html">Locations<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></a><div class="mega"></div></div>
      <div class="nav-item" data-mega="referrers"><a class="nav-link" href="{r}referrers.html">Referrers<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></a><div class="mega"></div></div>
      <div class="nav-item" data-mega="about"><a class="nav-link" href="{r}about.html">About<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></a><div class="mega"></div></div>
      <div class="nav-item" data-mega="contact"><a class="nav-link" href="{r}contact.html">Contact<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></a><div class="mega"></div></div>
      <div class="nav-cta"><a class="btn" href="{r}appointment.html">Request an appointment</a><a class="btn btn--ghost" href="tel:0390706116">Call 03 9070 6116</a></div>
    </nav>
    <div class="head-actions">
      <a class="head-phone" href="tel:0390706116" aria-label="Call 03 9070 6116"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>03 9070 6116</a>
      <a class="btn head-cta" href="{r}appointment.html">Request appointment</a>
    </div>
    <a class="head-call" href="tel:0390706116" aria-label="Call 03 9070 6116"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg></a>
    <button class="menu-btn" type="button" id="menuBtn" aria-expanded="false" aria-controls="mDrawer"><span class="mb-ico" aria-hidden="true"><i></i><i></i></span><span class="mb-label">Menu</span></button>
    <div class="m-drawer" id="mDrawer" aria-label="Site menu"></div>
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
        <a class="btn" style="justify-self:start" href="{r}appointment.html">Request an appointment</a>
      </div>
      <div><h4>Care</h4><ul id="footCare"></ul></div>
      <div><h4>Practice</h4><ul>
        <li><a href="{r}doctors.html">Doctors</a></li><li><a href="{r}services.html">Services</a></li><li><a href="{r}locations.html">Locations</a></li><li><a href="{r}about.html">About us</a></li><li><a href="{r}about.html#team">Our team</a></li><li><a href="{r}referrers.html">Referring doctors</a></li><li><a href="{r}contact.html">Contact</a></li><li><a href="https://totalcardiovascularcare.com.au/faqs/" target="_blank" rel="noopener">FAQs</a></li></ul></div>
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


def assemble(body, home, kind=""):
    """Every page ends with the shared contact section (home places it via {CONTACT}; the contact page has its own)."""
    contact = (SRC / "contact.html").read_text(encoding="utf-8")
    if home:
        return body.replace("{CONTACT}", contact)
    return body if kind in ("contact", "appointment") else body + contact


AREAS = [
    # key, slug, name, blurb, hero image
    ("general", "general-cardiology", "General cardiology", "Consultations and everyday diagnostics to assess symptoms, monitor your heart and plan treatment.", "hero-echo"),
    ("interventional", "interventional-cardiology", "Interventional cardiology", "Catheter-based procedures to image and open narrowed coronary arteries.", "interventional"),
    ("hf", "heart-failure", "Heart failure", "Long-term management of heart failure, including device therapy and remote pressure monitoring.", "tcc_banner_10"),
    ("imaging", "cardiac-imaging", "Cardiac imaging", "Detailed pictures of your heart's structure and function to guide diagnosis.", "cardiac-imaging2-1"),
    ("rhythm", "rhythm-management", "Rhythm management", "Diagnosis and treatment of heart rhythm disorders, from monitoring to ablation.", "hero-scan"),
    ("structural", "structural-heart", "Structural heart", "Minimally invasive treatment of heart valve and structural problems.", "hero-team"),
]
GUIDE = {"Coronary Intervention (Stents)": "coronary-angioplasty.html"}


def slugify(t):
    import re
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def render_blocks(blocks):
    out, ul = [], []
    def flush():
        if ul:
            out.append("<ul>" + "".join(f"<li>{html.escape(x)}</li>" for x in ul) + "</ul>")
            ul.clear()
    for kind, text in blocks:
        if kind == "li":
            ul.append(text)
            continue
        flush()
        # short title-case lines without closing punctuation are sub-headings on the source site
        looks_head = kind == "p" and len(text.split()) <= 7 and text[:1].isupper() and not text.rstrip().endswith((".", "!", ";", ",", ":"))
        out.append(f"<h4>{html.escape(text)}</h4>" if kind == "h" or looks_head else f"<p>{html.escape(text)}</p>")
    flush()
    return "\n".join(out)


def intro_of(blocks, limit=210):
    for kind, text in blocks:
        if kind == "p" and len(text) > 40:
            cut = text if len(text) <= limit else text[:limit].rsplit(" ", 1)[0] + "…"
            return cut
    return ""


def area_body(key, slug, name, blurb, img, procs):
    words = sum(len(t.split()) for p in procs for _, t in p["blocks"])
    jump = "".join(f'<a href="#{slugify(p["title"])}">{html.escape(p["title"])}</a>' for p in procs)
    items = []
    for i, p in enumerate(procs, 1):
        pid = slugify(p["title"])
        intro = intro_of(p["blocks"])
        guide = GUIDE.get(p["title"])
        if p["blocks"]:
            body = render_blocks(p["blocks"])
        else:
            body = '<p>Ask our team about this service. Call <a class="tel" href="tel:0390706116">03 9070 6116</a> or request an appointment online.</p>'
        guide_link = f'<a class="btn btn--ghost btn--sm" href="{{R}}services/{guide}">Read the full patient guide &rarr;</a>' if guide else ""
        items.append(f"""      <details class="pacc" id="{pid}"{' open' if i == 1 else ''}>
        <summary><span class="pacc-n">{i:02d}</span><span class="pacc-t"><b>{html.escape(p["title"])}</b>{f'<small>{html.escape(intro)}</small>' if intro else ''}</span><span class="pacc-x" aria-hidden="true"></span></summary>
        <div class="pacc-body prose-s">{body}
          <div class="pacc-actions"><a class="btn btn--sm" href="{{R}}appointment.html">Request an appointment</a>{guide_link}</div>
        </div>
      </details>""")
    return f"""<div class="wrap">
  <div class="band page-hero">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="{{R}}index.html">Home</a>/<a href="{{R}}services.html">Services</a>/<span aria-current="page">{html.escape(name)}</span></nav>
    <div class="ph-grid">
      <div class="ph-text">
        <span class="eyebrow">Area of care</span>
        <h1>{html.escape(name)}</h1>
        <p class="lede">{html.escape(blurb)}</p>
        <div class="actions"><a class="btn" href="{{R}}appointment.html">Request an appointment</a><a class="btn btn--ghost" href="#area-team">Our specialists</a></div>
      </div>
      <figure class="ph-media"><img src="{{R}}assets/img/{img}.webp" alt="{html.escape(name)} at Total Cardiovascular Care" width="1800" height="1200" fetchpriority="high"></figure>
    </div>
    <nav class="jump" aria-label="Procedures in {html.escape(name)}">{jump}</nav>
  </div>
  <dl class="dr-facts area-facts">
    <div><dt>Procedures &amp; tests</dt><dd>{len(procs):02d}</dd></div>
    <div><dt>Specialists</dt><dd id="areaCount">&nbsp;</dd></div>
    <div><dt>Clinics</dt><dd>07</dd></div>
    <div><dt>Bookings</dt><dd><a class="tel" href="tel:0390706116">03 9070 6116</a></dd></div>
  </dl>
  <div class="split" id="procedures">
    <div class="pacc-intro"><h2>Procedures &amp; tests</h2><p class="lede">Select a procedure to read what it involves, how to prepare and what to expect.</p></div>
    <div class="pacc-list">
{chr(10).join(items)}
    </div>
  </div>
  <div class="band-ink band-ink--inline" id="area-team"><div class="doctor-tools"><h2>Specialists in {html.escape(name.lower())}</h2><a href="{{R}}doctors.html">All doctors &rarr;</a></div><div class="doc-grid" id="areaRail"></div></div>
  <div class="split split--full">
    <div class="doctor-tools"><h2>Other areas of care</h2><a href="{{R}}services.html">All services &rarr;</a></div>
    <div class="area-grid" id="areaOthers"></div>
  </div>
</div>
"""


def page(path, title, desc, kind, body, slug=""):
    depth = len(Path(path).parts) - 1
    r = "../" * depth
    home = kind == "home"
    doc = (
        head(title, desc, r)
        + f'<body data-page="{kind}" data-root="{r}"' + (f' data-slug="{slug}"' if slug else "") + ">\n"
        + header(r, home)
        + "<main>\n" + assemble(body, home, kind).replace("{R}", r).replace("{A}", "#" if home else r + "index.html#") + "</main>\n"
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
        + ";\nwindow.TCC_LOCS=" + json.dumps(LOCS, ensure_ascii=False)
        + ";\nwindow.TCC_STAFF=" + json.dumps(data["staff"], ensure_ascii=False) + ";\n",
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
    INDEX = [
        ("doctors", "Our doctors | Cardiologists & physicians | Total Cardiovascular Care", "Thirteen cardiologists and physicians across general, interventional and structural cardiology, imaging, heart failure, rhythm and paediatric cardiology."),
        ("services", "Cardiology services | Total Cardiovascular Care", "Six areas of cardiac care: general, interventional, heart failure, imaging, rhythm management and structural heart."),
        ("locations", "Clinic locations | Total Cardiovascular Care", "Seven cardiology clinics from Highett to Inverloch, with main rooms in Frankston."),
        ("referrers", "For referring doctors | Total Cardiovascular Care", "How to refer to Total Cardiovascular Care specialists, and contact details for our Frankston main rooms."),
        ("about", "About us | Total Cardiovascular Care", "A comprehensive cardiology practice dedicated to helping patients achieve optimal heart health."),
        ("contact", "Contact | Total Cardiovascular Care", "Book online, call 03 9070 6116, email or visit one of our seven clinics."),
        ("appointment", "Request an appointment | Total Cardiovascular Care", "Request an appointment with a Total Cardiovascular Care specialist. Our team will contact you within 24 hours."),
    ]
    for k, title, desc in INDEX:
        built.append(page(f"{k}.html", title, desc, k, (SRC / "pages" / f"{k}.html").read_text(encoding="utf-8")))
    procedures = json.loads((SRC / "procedures.json").read_text(encoding="utf-8"))
    for key, slug, name, blurb, img in AREAS:
        built.append(page(
            f"services/{slug}.html",
            f"{name} | Total Cardiovascular Care",
            blurb,
            "area",
            area_body(key, slug, name, blurb, img, procedures[key]),
            key,
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
