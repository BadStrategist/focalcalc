/* FocalCalc — shared chrome: header/footer inject, consent gate, ad-slot renderer.
   Ad code is fully inert until ADSENSE_CLIENT is set post-approval — the site is
   self-sufficient without ads, per Google Publisher Policies. */
(function () {
  "use strict";

  const SITE = {
    name: "FocalCalc",
    tagline: "Photography calculators that know the camera you own",
    year: new Date().getFullYear()
  };

  const NAV = [
    ["Depth of Field", "/tools/depth-of-field.html"],
    ["Hyperfocal", "/tools/hyperfocal.html"],
    ["ND Filter", "/tools/nd-filter.html"],
    ["Flash GN", "/tools/flash-guide-number.html"],
    ["Pixel Scale", "/tools/pixel-scale.html"],
    ["Shutter Angle", "/tools/shutter-angle.html"],
    ["Guides", "/pages/guides.html"]
  ];

  const FOOT_LINKS = [
    ["About", "/pages/about.html"],
    ["Contact", "/pages/contact.html"],
    ["Privacy Policy", "/pages/privacy.html"],
    ["Terms", "/pages/terms.html"]
  ];

  function injectChrome() {
    const header = document.querySelector(".site-header");
    if (header) {
      header.innerHTML =
        '<div class="container">' +
        '<a class="brand" href="/">Focal<span>Calc</span></a>' +
        '<nav class="nav" aria-label="Main navigation">' +
        NAV.map(n => '<a href="' + n[1] + '">' + n[0] + "</a>").join("") +
        '</nav><button class="nav-toggle" aria-label="Menu">☰</button></div>';
      const t = header.querySelector(".nav-toggle");
      const nav = header.querySelector(".nav");
      t.addEventListener("click", () => { nav.style.display = nav.style.display === "flex" ? "none" : "flex"; nav.style.flexDirection = "column"; nav.style.alignItems = "flex-start"; });
    }
    const footer = document.querySelector(".site-footer");
    if (footer) {
      footer.innerHTML =
        '<div class="container">' +
        '<div><strong style="color:#fff">' + SITE.name + "</strong><br>" + SITE.tagline + "</div>" +
        '<nav class="fnav" aria-label="Footer navigation">' +
        FOOT_LINKS.map(l => '<a href="' + l[1] + '">' + l[0] + "</a>").join("") +
        "</nav></div>";
    }
  }

  /* --- consent (GDPR/EEA; Google-certified CMP script slot) --- */
  function consent() {
    const KEY = "fc-consent";
    const v = localStorage.getItem(KEY);
    if (v === "granted" || v === "denied") return v;
    return null;
  }
  function showConsent() {
    if (consent()) return;
    const bar = document.querySelector(".consent");
    if (!bar) return;
    bar.classList.add("show");
    document.body.classList.add("consent-open");
    const accept = bar.querySelector(".consent-accept");
    const deny = bar.querySelector(".consent-deny");
    const dismiss = () => { bar.classList.remove("show"); document.body.classList.remove("consent-open"); };
    accept.addEventListener("click", () => { localStorage.setItem("fc-consent", "granted"); dismiss(); });
    deny.addEventListener("click", () => { localStorage.setItem("fc-consent", "denied"); dismiss(); });
  }

  /* --- AdSense gate: inert until approval; renders only with consent --- */
  const ADSENSE_CLIENT = ""; // set after AdSense approval, e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  window.FC_ADS = {
    enabled: () => ADSENSE_CLIENT !== "" && consent() === "granted",
    render: function (slotId) {
      const el = document.getElementById(slotId);
      if (!el) return;
      if (!window.FC_ADS.enabled()) { el.innerHTML = ""; return; }
      el.innerHTML = '<span class="ad-label">Sponsored</span>' +
        '<ins class="adsbygoogle" style="display:block" data-ad-client="' + ADSENSE_CLIENT + '" ' +
        'data-ad-slot="' + slotId + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* noop */ }
    }
  };

  /* --- GoatCounter analytics: privacy-friendly, cookieless, GDPR-friendly.
     Inert until GOATCOUNTER_CODE is set (see SETUP_GUIDE.md). --- */
  const GOATCOUNTER_CODE = ""; // e.g. "focalcalc" -> https://focalcalc.goatcounter.com
  function loadAnalytics() {
    if (GOATCOUNTER_CODE === "") return;
    const s = document.createElement("script");
    s.setAttribute("data-goatcounter", "https://" + GOATCOUNTER_CODE + ".goatcounter.com/count");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(s);
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectChrome();
    showConsent();
    loadAnalytics();
    document.querySelectorAll("[data-ad]").forEach(el => window.FC_ADS.render(el.id || "ad-" + el.dataset.ad));
  });
})();
