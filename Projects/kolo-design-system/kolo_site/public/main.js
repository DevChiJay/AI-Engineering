/* Kolo launch page: Pot ring engine, motion choreography (GSAP + ScrollTrigger), bento, FAQ and demo form.
   Without GSAP, or with reduced motion, the page stays in its complete static state. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var SEGMENTS = 24;
  var PER_MEMBER = 4;
  var EACH = 50000;
  var TARGET = 300000;

  // Friday Circle, clockwise around the Pot from the top. Contribution order matches this list:
  // Adaeze, Tunde, Chioma and Ibrahim have paid this cycle; Funmi and Emeka are due Friday.
  var MEMBERS = [
    { initials: "AN", name: "Adaeze", you: true },
    { initials: "TB", name: "Tunde" },
    { initials: "CE", name: "Chioma" },
    { initials: "IM", name: "Ibrahim" },
    { initials: "FA", name: "Funmi" },
    { initials: "EO", name: "Emeka" }
  ];

  var naira = function (n) { return "₦" + n.toLocaleString("en-NG"); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var motion = hasGsap && !reduceMotion;
  if (motion) document.documentElement.classList.add("motion");

  /* ───────── SVG helpers ───────── */
  function el(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  // angle in degrees, 0 at the top, clockwise
  function pt(cx, cy, r, deg) {
    var a = (deg * Math.PI) / 180;
    return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  }
  function arc(cx, cy, r, a0, a1) {
    var p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1);
    return "M" + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + " A" + r + " " + r + " 0 0 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2);
  }

  // Shared defs: glows and the two Pot finishes. Colours come from the CSS tokens.
  var css = getComputedStyle(document.documentElement);
  var tok = function (n) { return css.getPropertyValue("--" + n).trim(); };
  (function buildDefs() {
    var svg = el("svg", { width: 0, height: 0, "aria-hidden": "true", focusable: "false" });
    svg.style.position = "absolute";
    var defs = el("defs", {}, svg);
    function glow(id, std) {
      var f = el("filter", { id: id, x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
      el("feGaussianBlur", { "in": "SourceGraphic", stdDeviation: std, result: "b" }, f);
      var m = el("feMerge", {}, f);
      el("feMergeNode", { "in": "b" }, m);
      el("feMergeNode", { "in": "SourceGraphic" }, m);
    }
    glow("glow-teal", 3.2);
    glow("glow-saffron", 2.4);
    var soft = el("filter", { id: "pot-shadow", x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs);
    el("feGaussianBlur", { stdDeviation: 14 }, soft);
    function body(id, stops) {
      var g = el("radialGradient", { id: id, cx: "42%", cy: "36%", r: "72%" }, defs);
      stops.forEach(function (s) { el("stop", { offset: s[0], "stop-color": tok(s[1]) }, g); });
    }
    body("pot-body-home", [["0%", "card"], ["58%", "ivory"], ["100%", "pot-edge"]]);
    body("pot-body-desk", [["0%", "indigo-raise"], ["60%", "indigo"], ["100%", "indigo-deep"]]);
    document.body.appendChild(svg);
  })();

  /* ───────── Pot top view: 24 segments on Ø60 (r 104), inner rim Ø33 (r 57), body Ø110 (r 186) ───────── */
  function buildPot(svg) {
    var desk = svg.getAttribute("data-edition") === "desk";
    el("circle", { cx: 200, cy: 212, r: 182, fill: tok(desk ? "indigo-deep" : "indigo"), opacity: desk ? .7 : .1, filter: "url(#pot-shadow)" }, svg);
    el("circle", { cx: 200, cy: 200, r: 186, fill: "url(#pot-body-" + (desk ? "desk" : "home") + ")" }, svg);
    if (desk) el("circle", { cx: 200, cy: 200, r: 185, fill: "none", stroke: tok("ivory-12"), "stroke-width": 2 }, svg);
    el("circle", { cx: 200, cy: 200, r: 168, fill: "none", stroke: tok(desk ? "ivory-12" : "stone-soft"), "stroke-width": 1.5 }, svg);
    var group = el("g", { "class": "seg-group" }, svg);
    var segs = [];
    for (var j = 0; j < SEGMENTS; j++) {
      segs.push(el("path", { "class": "seg", d: arc(200, 200, 104, j * 15 + 1.6, j * 15 + 13.4) }, group));
    }
    el("circle", { cx: 200, cy: 200, r: 57, fill: "none", stroke: tok(desk ? "ivory" : "indigo"), "stroke-width": 13 }, svg);
    var ripple = el("circle", { "class": "ripple", cx: 200, cy: 200, r: 44 }, svg);
    return { svg: svg, segs: segs, ripple: ripple, key: "" };
  }

  function memberSegs(k) {
    return [k * 4 - 2, k * 4 - 1, k * 4, k * 4 + 1].map(function (x) { return (x + SEGMENTS) % SEGMENTS; });
  }
  // states[24] of "off" | "due" | "paid"
  function cycleStates(segsLit, lit) {
    var out = new Array(SEGMENTS).fill("off");
    if (!lit) return out;
    for (var k = 0; k < MEMBERS.length; k++) {
      var ms = memberSegs(k);
      for (var i = 0; i < PER_MEMBER; i++) out[ms[i]] = k * PER_MEMBER + i < segsLit ? "paid" : "due";
    }
    return out;
  }
  function healthStates(score) {
    var n = Math.round((score / 100) * SEGMENTS);
    var high = score >= 60;
    return new Array(SEGMENTS).fill("off").map(function (_, j) { return j < n ? (high ? "paid" : "due") : "off"; });
  }
  function paint(pot, states, breathe) {
    var key = states.join("") + (breathe ? "b" : "");
    if (key === pot.key) return;
    pot.key = key;
    for (var j = 0; j < SEGMENTS; j++) {
      pot.segs[j].classList.toggle("is-paid", states[j] === "paid");
      pot.segs[j].classList.toggle("is-due", states[j] === "due");
    }
    pot.svg.classList.toggle("is-breathing", !!breathe);
  }
  function rippleOnce(pot) {
    if (!motion) return;
    gsap.fromTo(pot.ripple, { attr: { r: 44 }, opacity: .9 }, { attr: { r: 150 }, opacity: 0, duration: 1.1, ease: "power2.out" });
  }

  /* ───────── Hero ───────── */
  var heroPot = buildPot(document.querySelector(".stage__top"));
  var stage = document.getElementById("hero-stage");
  var avatarLayer = stage.querySelector(".stage__avatars");
  var heroAvatars = MEMBERS.map(function (m, k) {
    var slot = document.createElement("span");
    slot.className = "stage__slot";
    slot.style.setProperty("--a", k * 60 + "deg");
    var a = document.createElement("span");
    a.className = "kl-avatar stage__avatar" + (m.you ? " kl-avatar--you" : "");
    a.textContent = m.initials;
    slot.appendChild(a);
    avatarLayer.appendChild(slot);
    return a;
  });
  function sizeAvatars() { stage.style.setProperty("--r", (stage.clientWidth * 0.455).toFixed(1) + "px"); }
  sizeAvatars();
  window.addEventListener("resize", sizeAvatars);

  var heroAmount = document.querySelector('[data-hero="amount"]');
  var heroStatus = document.querySelector('[data-hero="status"]');
  var heroSteps = Array.prototype.slice.call(document.querySelectorAll(".hero__steps li"));
  var DEFAULT_STATUS = "Today in Friday Circle: <b>4 of 6 paid</b>. Payout is Friday.";
  var heroKey = "";

  function setHero(amount, status, step, avatarState) {
    var key = amount + status + step + avatarState.join("");
    if (key === heroKey) return;
    heroKey = key;
    heroAmount.textContent = naira(amount);
    heroStatus.innerHTML = status;
    heroSteps.forEach(function (li, i) { li.classList.toggle("is-active", i === step); });
    heroAvatars.forEach(function (a, k) {
      a.classList.toggle("kl-avatar--paid", avatarState[k] === "paid");
      a.classList.toggle("kl-avatar--due", avatarState[k] === "due");
    });
  }
  // Static resting state: matches the photo's ring, 16 of 24 segments.
  function heroRest() {
    setHero(200000, DEFAULT_STATUS, 1, ["paid", "paid", "paid", "paid", "due", "due"]);
    paint(heroPot, cycleStates(16, true), false);
  }
  heroRest();

  // Scroll progress p (0..1) → one cycle of the Pot.
  function heroAt(p) {
    if (p < 0.2) { heroRest(); return; }
    var lit = p >= 0.22;
    var segsLit = p < 0.3 ? 0 : clamp(Math.floor(((p - 0.3) / 0.6) * SEGMENTS + 1e-6), 0, SEGMENTS);
    var paid = Math.floor(segsLit / PER_MEMBER);
    var payout = p >= 0.93;
    var avatars = MEMBERS.map(function (_, k) { return !lit ? "none" : k < paid ? "paid" : "due"; });
    var status, step = 1;
    if (payout) { status = "Payout day · <b>Adaeze collects ₦300,000</b> on Fri 27 Feb"; step = 2; }
    else if (!lit) { status = "A new cycle starts. Tap the Pot."; step = 0; }
    else if (paid === 0) { status = "Saffron is still due · <b>0 of 6 paid</b>"; step = 0; }
    else if (paid === 4) { status = "Today in Friday Circle: <b>4 of 6 paid</b>. Payout is Friday."; }
    else if (paid === 6) { status = "Emeka paid ₦50,000 · <b>the Pot is full</b>"; }
    else { status = MEMBERS[paid - 1].name + " paid ₦50,000 · <b>" + paid + " of 6 paid</b>"; }
    setHero(paid * EACH, status, step, avatars);
    paint(heroPot, cycleStates(segsLit, lit), payout);
  }

  /* ───────── Bento: the Pot card's avatars, and expansion ───────── */
  (function bentoPot() {
    var wrap = document.getElementById("bento-pot-ring");
    MEMBERS.forEach(function (m, k) {
      var p = pt(150, 150, 128, k * 60);
      var a = document.createElement("span");
      var paid = k < 4;
      a.className = "kl-avatar kl-pot__member " + (paid ? "kl-avatar--paid" : "kl-avatar--due") + (m.you ? " kl-avatar--you" : "");
      a.style.left = p[0] + "px";
      a.style.top = p[1] + "px";
      a.textContent = m.initials;
      a.title = m.name + (m.you ? " (you)" : "") + " · " + (paid ? "Paid" : "Due Fri");
      wrap.appendChild(a);
    });
  })();

  var cards = Array.prototype.slice.call(document.querySelectorAll(".bento__card"));
  function openCard(card) {
    cards.forEach(function (c) {
      var on = c === card;
      c.classList.toggle("is-open", on);
      c.querySelector(".bento__toggle").setAttribute("aria-expanded", on ? "true" : "false");
    });
  }
  cards.forEach(function (card) {
    if (card.querySelector(".bento__toggle").getAttribute("aria-expanded") === "true") card.classList.add("is-open");
    card.querySelector(".bento__toggle").addEventListener("click", function (e) {
      e.stopPropagation();
      openCard(card.classList.contains("is-open") ? null : card);
    });
    card.addEventListener("click", function () { if (!card.classList.contains("is-open")) openCard(card); });
  });

  /* ───────── Indigo chapter: the Pot simulator ───────── */
  var ringPot = buildPot(document.getElementById("ring-pot"));
  var ring = { mode: "cycle", segs: 16, touched: false };
  var out = {
    segs: document.querySelector('[data-ring="segs"]'),
    paid: document.querySelector('[data-ring="paid"]'),
    amount: document.querySelector('[data-ring="amount"]'),
    mode: document.querySelector('[data-ring="mode"]')
  };
  var modeButtons = Array.prototype.slice.call(document.querySelectorAll(".ring-controls [aria-pressed]"));

  function renderRing() {
    var paid = Math.floor(ring.segs / PER_MEMBER);
    var lit = ring.segs, amount = paid * EACH, text, pressed = "tap";
    if (ring.mode === "health") {
      paint(ringPot, healthStates(86), false);
      lit = Math.round(0.86 * SEGMENTS);
      text = "Double tap · Circle Health 86, Healthy";
      pressed = "health";
    } else if (ring.mode === "payout") {
      paint(ringPot, cycleStates(SEGMENTS, true), true);
      lit = SEGMENTS; paid = 6; amount = TARGET;
      text = "Payout day · full teal ring, slow breathe";
      pressed = "payout";
    } else {
      paint(ringPot, cycleStates(ring.segs, true), false);
      text = paid === 6 ? "All six paid. The Pot is full." : "Tap · showing this cycle's Pot for 10 s";
    }
    out.segs.textContent = lit;
    out.paid.textContent = paid;
    out.amount.textContent = naira(amount);
    out.mode.textContent = text;
    modeButtons.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-action") === pressed ? "true" : "false"); });
  }
  renderRing();

  document.querySelector(".ring-controls").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    ring.touched = true;
    var act = b.getAttribute("data-action");
    if (act === "pay") {
      if (ring.mode !== "cycle") ring.mode = "cycle";
      ring.segs = Math.min(SEGMENTS, (Math.floor(ring.segs / PER_MEMBER) + 1) * PER_MEMBER);
    } else if (act === "reset") { ring.mode = "cycle"; ring.segs = 0; }
    else if (act === "tap") { ring.mode = "cycle"; }
    else { ring.mode = act; }
    if (act === "tap" || act === "health") rippleOnce(ringPot);
    renderRing();
  });

  /* ───────── Nav, FAQ, demo form ───────── */
  var nav = document.querySelector(".nav");
  window.addEventListener("scroll", function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });

  var form = document.getElementById("demo-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var error = document.getElementById("demo-error");
    var done = document.getElementById("demo-done");
    if (!name || email.indexOf("@") < 1) { error.hidden = false; done.hidden = true; return; }
    error.hidden = true;
    var first = name.split(/\s+/)[0];
    document.getElementById("demo-done-text").textContent =
      "Thanks, " + first + ". In a live launch, we'd book a demo for a " + form.elements.size.value + "-member " +
      form.elements.type.value.toLowerCase() + " circle with " + email + ". This is a concept page, so nothing was sent.";
    done.hidden = false;
    done.focus();
  });

  /* ───────── Motion ───────── */
  if (!motion) return;
  gsap.registerPlugin(ScrollTrigger);
  var navH = function () { return nav.offsetHeight; };

  // Intro: "Motion by Claude". The wordmark draws, the headline rises through its mask, the Pot is unveiled.
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .to(".wordmark :is(path, circle)", { strokeDashoffset: 0, duration: 1.1, stagger: 0.07, ease: "power2.inOut" }, 0)
    .from(".hero__title .line > span", { yPercent: 110, duration: 1.1, stagger: 0.11 }, 0.15)
    .from(".stage__photo", { clipPath: "circle(0% at 50% 58%)", scale: 1.08, duration: 1.5, ease: "expo.out", clearProps: "clipPath" }, 0.25)
    .from(".hero__lede, .hero__actions, .hero__steps", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.55)
    .from(".readout, .credit", { opacity: 0, y: 12, duration: 0.8 }, 0.9);

  var mm = gsap.matchMedia();

  mm.add({ wide: "(min-width: 901px)", narrow: "(max-width: 900px)" }, function (ctx) {
    var wide = ctx.conditions.wide;

    // Hero: the camera moves overhead, then one cycle plays out on the ring.
    var hero = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: wide
        ? { trigger: ".hero", start: function () { return "top " + navH() + "px"; }, end: function () { return "+=" + window.innerHeight * 2.4; },
            pin: ".hero", scrub: 0.7, onUpdate: function (s) { heroAt(s.progress); } }
        : { trigger: ".stage", start: "top 70%", end: "+=" + window.innerHeight * 1.4, scrub: 0.7, onUpdate: function (s) { heroAt(s.progress); } }
    });
    hero
      .to(".stage__photo", { scale: 0.72, yPercent: -8, opacity: 0, duration: 0.2, ease: "power1.in" }, 0)
      .fromTo(".stage__top", { opacity: 0, scale: 0.62, rotationX: 62, yPercent: -10, transformPerspective: 900 },
        { opacity: 1, scale: 1, rotationX: 0, yPercent: 0, duration: 0.2, ease: "power2.out" }, 0.02)
      .fromTo(".stage__avatar", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.05, stagger: 0.01, ease: "back.out(2)" }, 0.17)
      .fromTo(heroPot.ripple, { attr: { r: 44 }, opacity: 0.9 }, { attr: { r: 160 }, opacity: 0, duration: 0.08 }, 0.2)
      .to(".hero__copy", { y: wide ? -30 : 0, duration: 1 }, 0);

    // Indigo chapter: the panel opens through a mask, then pins while the ring fills to today's state.
    gsap.fromTo(".ring-chapter__panel",
      { clipPath: "inset(7% 5% 7% 5% round 56px)" },
      { clipPath: "inset(0% 0% 0% 0% round 40px)", ease: "none",
        scrollTrigger: { trigger: ".ring-chapter", start: "top bottom", end: "top 15%", scrub: true } });

    ScrollTrigger.create(wide
      ? { trigger: ".ring-chapter", start: function () { return "top " + navH() + "px"; }, end: function () { return "+=" + window.innerHeight * 1.1; },
          pin: true, scrub: true, onUpdate: ringScrub }
      : { trigger: ".ring-pot", start: "top 75%", end: "bottom 35%", scrub: true, onUpdate: ringScrub });

    function ringScrub(s) {
      if (ring.touched) return;
      ring.mode = "cycle";
      ring.segs = clamp(Math.round(s.progress * 1.15 * 16), 0, 16);
      renderRing();
    }
  });

  // Masked line reveals for headlines below the hero.
  gsap.utils.toArray(".reveal-lines").forEach(function (h) {
    gsap.from(h.querySelectorAll(".line > span"), {
      yPercent: 105, duration: 1.05, stagger: 0.09, ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 88%", once: true }
    });
  });

  // Masked image reveals: always partly visible, then the mask opens.
  gsap.utils.toArray(".reveal-mask").forEach(function (fig) {
    var img = fig.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 90%", once: true } });
    tl.fromTo(fig, { clipPath: "inset(12% 10% 12% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.out", clearProps: "clipPath" })
      .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.6, ease: "expo.out", clearProps: "transform" }, 0);
  });

  // Parallax: phones and editions drift at different speeds.
  [[".phone--a", -40], [".phone--b", 50], [".phone--c", -90], [".edition--desk", -70]].forEach(function (p) {
    gsap.to(p[0], { y: p[1], ease: "none", scrollTrigger: { trigger: p[0], start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Stat lines in the statement rise in once.
  gsap.from(".facts > div", {
    opacity: 0, y: 14, duration: 0.6, stagger: 0.05, ease: "power2.out",
    scrollTrigger: { trigger: ".facts", start: "top 92%", once: true }
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
