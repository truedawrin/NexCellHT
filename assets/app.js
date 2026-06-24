(function(){
// NexCell HT™ — storefront
const { I18n, LANGS, CATEGORIES, Store, Auth } = window.NexCell;
const WHATSAPP = "50938422993";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

let activeCategory = "all";

function logoSVG() {
  return `<a href="index.html" class="logo">
    <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
        <defs><linearGradient id="ncg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A84FF"/><stop offset="1" stop-color="#00E5FF"/></linearGradient></defs>
        <rect x="8" y="2.5" width="16" height="27" rx="3.5" stroke="url(#ncg)" stroke-width="1.8"/>
        <rect x="13.5" y="26" width="5" height="1.3" rx="0.6" fill="url(#ncg)"/>
        <path d="M17.5 8 L11.5 17.5 H15.5 L13.8 24 L21 14.5 H17 L19 8 Z" fill="url(#ncg)"/>
      </svg>
    </span>
    <span class="logo-name">NexCell<sup>HT™</sup></span>
  </a>`;
}

function renderNavbar(isAdminPage = false) {
  const authed = Auth.isAuthed();
  const langBtns = LANGS.map(l => `<button class="lang-btn${I18n.lang===l.code?' active':''}" data-lang="${l.code}">${l.label}</button>`).join("");
  const adminLink = (authed && !isAdminPage) ? `<a href="admin.html" class="pill-link">${esc(I18n.t("dash_title"))}</a>` : "";
  const backLink = isAdminPage ? `<a href="index.html" class="pill-link">${esc(I18n.t("nav_back_to_store"))}</a>` : "";
  const icon = (authed && isAdminPage)
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  return `<header class="nav"><div class="container nav-inner">
    ${logoSVG()}
    <div class="nav-actions">
      <div class="lang-switch">${langBtns}</div>
      ${adminLink}${backLink}
      <button class="icon-btn" id="adminBtn" title="${esc(I18n.t("nav_admin"))}">${icon}</button>
    </div>
  </div></header>`;
}

function bindNavbar(isAdminPage = false) {
  $$(".lang-btn").forEach(b => b.addEventListener("click", () => I18n.set(b.dataset.lang)));
  const btn = $("#adminBtn");
  if (btn) btn.addEventListener("click", () => {
    if (Auth.isAuthed()) {
      if (isAdminPage) { Auth.logout(); location.href = "index.html"; }
      else location.href = "admin.html";
    } else openLoginModal();
  });
}

function openLoginModal() {
  const wrap = document.createElement("div");
  wrap.className = "modal-overlay";
  wrap.innerHTML = `<form class="modal glass fade-up">
    <h2>${esc(I18n.t("admin_login_title"))}</h2>
    <p class="sub">NexCell HT™</p>
    <label class="label" style="margin-top:20px;">${esc(I18n.t("admin_password_label"))}</label>
    <input class="input" type="password" autofocus placeholder="••••••••••" />
    <p class="error-msg" style="display:none;">${esc(I18n.t("admin_login_error"))}</p>
    <div class="modal-actions">
      <button type="button" class="btn-ghost" data-cancel>${esc(I18n.t("admin_cancel"))}</button>
      <button type="submit" class="glow-btn">${esc(I18n.t("admin_login_btn"))}</button>
    </div>
  </form>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.addEventListener("click", e => { if (e.target === wrap) close(); });
  wrap.querySelector("[data-cancel]").addEventListener("click", close);
  wrap.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const pw = wrap.querySelector("input").value;
    if (Auth.login(pw)) { close(); location.href = "admin.html"; }
    else wrap.querySelector(".error-msg").style.display = "block";
  });
}

function renderHero() {
  const title = I18n.t("hero_title");
  const parts = title.split(",");
  const titleHTML = parts.map((p, i) =>
    i === parts.length - 1
      ? `<span class="hero-grad">${esc(p)}</span>`
      : `${esc(p)},<br/>`
  ).join("");
  return `<section class="hero">
    <div class="hero-grid"></div>
    <div class="hero-glow"></div>
    <div class="container hero-inner">
      <div class="fade-up">
        <span class="hero-badge"><span class="dot"></span>NexCell HT™ · Haiti</span>
        <h1 class="hero-title">${titleHTML}</h1>
        <p class="hero-sub">${esc(I18n.t("hero_subtitle"))}</p>
        <div class="hero-cta-wrap">
          <button class="glow-btn" id="heroCta" style="padding:14px 24px;font-size:14px;">
            ${esc(I18n.t("hero_cta"))}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-blob one"></div>
        <div class="hero-blob two"></div>
        <svg viewBox="0 0 220 420" width="220" height="420" class="float-phone" style="position:relative;filter:drop-shadow(0 30px 60px rgba(0,229,255,0.35));">
          <defs>
            <linearGradient id="phbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A84FF" stop-opacity="0.6"/><stop offset="1" stop-color="#00E5FF" stop-opacity="0.2"/></linearGradient>
            <linearGradient id="phf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1226"/><stop offset="1" stop-color="#020610"/></linearGradient>
          </defs>
          <rect x="8" y="8" width="204" height="404" rx="36" fill="url(#phbg)"/>
          <rect x="14" y="14" width="192" height="392" rx="32" fill="url(#phf)" stroke="rgba(0,229,255,0.5)" stroke-width="1.2"/>
          <rect x="90" y="22" width="40" height="10" rx="5" fill="#000"/>
          <g transform="translate(110 200)"><path d="M0 -60 L-32 10 L-6 10 L-16 60 L28 -10 L4 -10 L18 -60 Z" fill="url(#phbg)" stroke="#00E5FF" stroke-width="1.5"/></g>
        </svg>
      </div>
    </div>
  </section>`;
}

function renderWhyUs() {
  const stats = [
    { v: 150, s: "+", l: I18n.t("stat_clients") },
    { v: 500, s: "+", l: I18n.t("stat_sold") },
    { v: 100, s: "%", l: I18n.t("stat_authentic") },
    { v: 24, s: "h", l: I18n.t("stat_delivery") },
  ];
  const feats = [
    { i: "🔒", l: I18n.t("feat_original") },
    { i: "🚀", l: I18n.t("feat_delivery") },
    { i: "💬", l: I18n.t("feat_support") },
    { i: "💳", l: I18n.t("feat_price") },
  ];
  return `<section class="why"><div class="container">
    <h2>${esc(I18n.t("why_title"))}</h2>
    <div class="stats">${stats.map(s => `<div class="glass stat"><p class="stat-num" data-counter="${s.v}" data-suffix="${s.s}">0${s.s}</p><p class="stat-lbl">${esc(s.l)}</p></div>`).join("")}</div>
    <div class="feats">${feats.map(f => `<div class="glass feat"><div class="feat-icon">${f.i}</div><p class="feat-lbl">${esc(f.l)}</p></div>`).join("")}</div>
  </div></section>`;
}

function bindCounters() {
  $$("[data-counter]").forEach(el => {
    const to = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    let started = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / 1500);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(to * eased).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });
}

function renderFilters() {
  const items = [{ value: "all", key: "cat_all" }, ...CATEGORIES];
  return `<div class="filters scrollbar-hide">${items.map(c => `<button class="filter-pill${activeCategory===c.value?' active':''}" data-cat="${c.value}">${esc(I18n.t(c.key))}</button>`).join("")}</div>`;
}

function renderProductCard(p) {
  const specs = [
    p.storage && p.storage.length ? p.storage.join(" / ") : null,
    p.colors && p.colors.length ? p.colors.join(", ") : null,
    p.ram ? `RAM ${p.ram}` : null,
    p.condition ? (p.condition === "new" ? I18n.t("f_new") : I18n.t("f_refurb")) : null,
  ].filter(Boolean).join(" · ");
  const message = `Bonjour, je souhaite commander: ${p.name}${specs ? " " + specs : ""}`;
  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  const isOut = p.status === "out";
  const badgeCls = p.status === "in" ? "badge-in" : p.status === "low" ? "badge-low" : "badge-out";
  const badgeLbl = p.status === "in" ? I18n.t("stock_in") : p.status === "low" ? I18n.t("stock_low") : I18n.t("stock_out");
  const img = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" style="${isOut?'opacity:0.4;filter:grayscale(1);':''}"/>`
    : `<div class="placeholder"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r=".7" fill="currentColor"/></svg></div>`;
  const tags = (p.tags || []).map(t => `<span class="tag" style="color:${t.color};border-color:${t.color}66;background:${t.color}1a;box-shadow:0 0 12px -4px ${t.color}80;">${esc(t.label)}</span>`).join("");
  const waBtn = isOut
    ? `<span class="wa-disabled">${waSvg()}${esc(I18n.t("order_whatsapp"))}</span>`
    : `<a class="glow-btn" href="${waUrl}" target="_blank" rel="noreferrer">${waSvg()}${esc(I18n.t("order_whatsapp"))}</a>`;
  return `<article class="glass card">
    <div class="card-img">${img}
      <div class="card-badge-pos"><span class="badge ${badgeCls}"><span class="dot"></span>${esc(badgeLbl)}</span></div>
      ${isOut ? `<div class="out-veil"><span>${esc(I18n.t("stock_out"))}</span></div>` : ""}
    </div>
    <div class="card-body">
      <div>
        <p class="brand">${esc(p.brand || "")}</p>
        <h3 class="pname">${esc(p.name)}</h3>
        ${specs ? `<p class="pspecs">${esc(specs)}</p>` : ""}
      </div>
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      <div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;padding-top:8px;">
        <p class="price">${Number(p.price||0).toLocaleString()} <span class="cur">${esc(p.currency||"HTG")}</span></p>
      </div>
      ${waBtn}
    </div>
  </article>`;
}

function waSvg() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.93 9.93 0 0 0 5.79 1.85h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.52.66.67-2.46-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.52 3.69-8.2 8.21-8.2 2.19 0 4.25.85 5.8 2.4a8.12 8.12 0 0 1 2.4 5.81c0 4.52-3.68 8.2-8.2 8.2zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.4-.12-.56.13s-.65.8-.79.97c-.15.16-.29.18-.54.06s-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.71c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>`;
}

function renderProducts() {
  const visible = Store.products.filter(p => p.visible !== false);
  const filtered = activeCategory === "all" ? visible : visible.filter(p => p.category === activeCategory);
  if (!filtered.length) {
    return `<div class="glass empty">${esc(I18n.t("no_products"))}</div>`;
  }
  return `<div class="product-grid">${filtered.map(renderProductCard).join("")}</div>`;
}

function renderStorefront() {
  document.body.innerHTML = `
    ${renderNavbar(false)}
    <main>
      ${renderHero()}
      ${renderWhyUs()}
      <section class="products" id="products">
        <div class="container">
          <div class="products-head">
            <p class="products-head-eyebrow">Catalogue</p>
            <h2>${esc(I18n.t("dash_products"))}</h2>
          </div>
          <div id="filtersHost">${renderFilters()}</div>
          <div id="productsHost">${renderProducts()}</div>
        </div>
      </section>
      <footer>© ${new Date().getFullYear()} NexCell HT™ — ${esc(I18n.t("footer_rights"))}</footer>
    </main>`;
  bindNavbar(false);
  bindCounters();
  $("#heroCta")?.addEventListener("click", () => $("#products")?.scrollIntoView({ behavior: "smooth" }));
  bindFilters();
}

function bindFilters() {
  $$(".filter-pill").forEach(b => b.addEventListener("click", () => {
    activeCategory = b.dataset.cat;
    $("#filtersHost").innerHTML = renderFilters();
    $("#productsHost").innerHTML = renderProducts();
    bindFilters();
  }));
}

I18n.onChange(renderStorefront);
Store.onChange(() => { $("#productsHost") && ($("#productsHost").innerHTML = renderProducts()); });

// Seed with welcome demo products if empty
if (!Store.products.length) {
  const seed = [
    { name: "iPhone 15 Pro Max", category: "iphone", brand: "Apple", storage: ["256GB","512GB"], colors: ["Natural Titanium","Black"], ram: "8GB", condition: "new", price: 95000, currency: "HTG", quantity: 4, status: "in", tags: [{label:"Nouveau",color:"#00E5FF"}], visible: true },
    { name: "Samsung Galaxy S24 Ultra", category: "android", brand: "Samsung", storage: ["256GB"], colors: ["Titanium Gray"], ram: "12GB", condition: "new", price: 78000, currency: "HTG", quantity: 2, status: "low", tags: [{label:"Promo",color:"#FF4D6D"}], visible: true },
    { name: "AirPods Pro 2", category: "audio", brand: "Apple", storage: [], colors: [], price: 22000, currency: "HTG", quantity: 10, status: "in", tags: [], visible: true },
    { name: "iPad Air M2", category: "tablet", brand: "Apple", storage: ["128GB"], colors: ["Space Gray"], ram: "8GB", condition: "new", price: 65000, currency: "HTG", quantity: 3, status: "low", tags: [{label:"Hot",color:"#FFA630"}], visible: true },
  ];
  seed.forEach(p => Store.add(p));
}

renderStorefront();
})();
