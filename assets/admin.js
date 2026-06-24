(function(){
// NexCell HT™ — admin
const { I18n, LANGS, CATEGORIES, SPEC_CATEGORIES, TAG_PALETTE, Store, Auth } = window.NexCell;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const STORAGE_OPTS = ["64GB","128GB","256GB","512GB","1TB"];

if (!Auth.isAuthed()) { location.href = "index.html"; }

let view = "dashboard"; // "dashboard" | "add" | "manage"
let editing = null;
let draft = emptyDraft();
let confirmId = null;

function emptyDraft() {
  return { name:"", category:"iphone", brand:"", storage:[], colors:[], ram:"", condition:"new", compatibility:"", price:0, currency:"HTG", quantity:1, status:"in", image:undefined, tags:[], visible:true };
}

function logoSVG() {
  return `<a href="index.html" class="logo">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none"><defs><linearGradient id="ncg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A84FF"/><stop offset="1" stop-color="#00E5FF"/></linearGradient></defs>
        <rect x="8" y="2.5" width="16" height="27" rx="3.5" stroke="url(#ncg)" stroke-width="1.8"/>
        <rect x="13.5" y="26" width="5" height="1.3" rx="0.6" fill="url(#ncg)"/>
        <path d="M17.5 8 L11.5 17.5 H15.5 L13.8 24 L21 14.5 H17 L19 8 Z" fill="url(#ncg)"/>
      </svg>
    </span>
    <span class="logo-name">NexCell<sup>HT™</sup></span>
  </a>`;
}

function renderNavbar() {
  const langBtns = LANGS.map(l => `<button class="lang-btn${I18n.lang===l.code?' active':''}" data-lang="${l.code}">${l.label}</button>`).join("");
  return `<header class="nav"><div class="container nav-inner">
    ${logoSVG()}
    <div class="nav-actions">
      <div class="lang-switch">${langBtns}</div>
      <a href="index.html" class="pill-link">${esc(I18n.t("nav_back_to_store"))}</a>
      <button class="icon-btn" id="logoutBtn" title="${esc(I18n.t("nav_logout"))}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
      </button>
    </div>
  </div></header>`;
}

function dashboardView() {
  const products = Store.products;
  const total = products.length;
  const inStock = products.filter(p => p.status !== "out" && p.quantity > 0).length;
  const out = products.filter(p => p.status === "out" || p.quantity <= 0).length;
  const promo = products.filter(p => (p.tags||[]).some(t => (t.label||"").toLowerCase().includes("promo"))).length;
  const cats = new Set(products.map(p => p.category)).size;
  const cards = [
    { l: I18n.t("stat_total"), v: total, c: "" },
    { l: I18n.t("stat_in_stock"), v: inStock, c: "color:var(--success);" },
    { l: I18n.t("stat_out_stock"), v: out, c: "color:var(--danger);" },
    { l: I18n.t("stat_promo"), v: promo, c: "color:var(--accent);" },
    { l: I18n.t("stat_cats"), v: cats, c: "" },
  ];
  const catChips = CATEGORIES.map(c => {
    const n = products.filter(p => p.category === c.value).length;
    return `<span class="cat-chip">${esc(I18n.t(c.key))} · <strong>${n}</strong></span>`;
  }).join("");
  return `<div>
    <h1 class="dash-h1">${esc(I18n.t("dash_title"))}</h1>
    <p class="dash-sub">NexCell HT™</p>
  </div>
  <div class="stat-grid">${cards.map(s => `<div class="glass scard"><p>${esc(s.l)}</p><p style="${s.c}">${s.v}</p></div>`).join("")}</div>
  <div class="glass cat-strip"><p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted-foreground);">Catégories</p><div class="row">${catChips}</div></div>`;
}

function field(label, inner) { return `<div><label class="label">${esc(label)}</label>${inner}</div>`; }

function formView() {
  const showSpecs = SPEC_CATEGORIES.includes(draft.category);
  const catOpts = CATEGORIES.map(c => `<option value="${c.value}"${draft.category===c.value?' selected':''}>${esc(I18n.t(c.key))}</option>`).join("");
  const storagePills = STORAGE_OPTS.map(s => `<button type="button" class="storage-pill${draft.storage.includes(s)?' active':''}" data-storage="${s}">${s}</button>`).join("");
  const colorChips = draft.colors.map(c => `<span class="chip">${esc(c)}<button type="button" data-rm-color="${esc(c)}">×</button></span>`).join("");
  const tagChips = draft.tags.map((tg, i) => `<span class="tag-chip" style="color:${tg.color};border-color:${tg.color}66;background:${tg.color}1a;box-shadow:0 0 10px -3px ${tg.color}80;">${esc(tg.label)}<button type="button" data-rm-tag="${i}" style="opacity:.7;">×</button></span>`).join("");
  return `<form class="glass form-card" id="pform">
    <h3>${esc(editing ? I18n.t("dash_edit") : I18n.t("dash_add"))}</h3>
    <div class="fgrid">
      ${field(I18n.t("f_name"), `<input class="input" data-f="name" value="${esc(draft.name)}" required/>`)}
      ${field(I18n.t("f_category"), `<select class="input" data-f="category">${catOpts}</select>`)}
      ${field(I18n.t("f_brand"), `<input class="input" data-f="brand" value="${esc(draft.brand)}"/>`)}
      ${field(I18n.t("f_price"), `<div style="display:flex;gap:8px;">
        <input class="input" type="number" min="0" data-f="price" value="${draft.price}"/>
        <select class="input" data-f="currency" style="width:112px;">
          <option value="HTG"${draft.currency==="HTG"?' selected':''}>HTG</option>
          <option value="USD"${draft.currency==="USD"?' selected':''}>USD</option>
        </select></div>`)}
      ${field(I18n.t("f_qty"), `<input class="input" type="number" min="0" data-f="quantity" value="${draft.quantity}"/>`)}
      ${field(I18n.t("f_status"), `<select class="input" data-f="status">
        <option value="in"${draft.status==="in"?' selected':''}>${esc(I18n.t("stock_in"))}</option>
        <option value="low"${draft.status==="low"?' selected':''}>${esc(I18n.t("stock_low"))}</option>
        <option value="out"${draft.status==="out"?' selected':''}>${esc(I18n.t("stock_out"))}</option>
      </select>`)}
    </div>
    ${showSpecs ? `<div class="spec-box">
      <p class="spec-box-eyebrow">${esc(I18n.t("f_specs"))}</p>
      <div class="fgrid">
        ${field(I18n.t("f_storage"), `<div style="display:flex;flex-wrap:wrap;gap:8px;">${storagePills}</div>`)}
        ${field(I18n.t("f_ram"), `<input class="input" data-f="ram" value="${esc(draft.ram||"")}" placeholder="8GB"/>`)}
        ${field(I18n.t("f_colors"), `<div style="display:flex;gap:8px;"><input class="input" id="colorInput" placeholder="${esc(I18n.t("f_add_color"))}"/><button type="button" id="addColorBtn" class="btn-ghost">+</button></div><div class="row-tags">${colorChips}</div>`)}
        ${field(I18n.t("f_condition"), `<select class="input" data-f="condition">
          <option value="new"${draft.condition==="new"?' selected':''}>${esc(I18n.t("f_new"))}</option>
          <option value="refurb"${draft.condition==="refurb"?' selected':''}>${esc(I18n.t("f_refurb"))}</option>
        </select>`)}
        <div style="grid-column:1/-1;">${field(I18n.t("f_compat"), `<textarea class="input" data-f="compatibility" style="min-height:80px;">${esc(draft.compatibility||"")}</textarea>`)}</div>
      </div>
    </div>` : ""}
    <div class="fgrid" style="margin-top:24px;">
      ${field(I18n.t("f_image"), `<input type="file" accept="image/*" id="imgInput" class="file-input"/>${draft.image ? `<img class="thumb-preview" src="${esc(draft.image)}" alt=""/>` : ""}`)}
      ${field(I18n.t("f_tags"), `<div style="display:flex;gap:8px;"><input class="input" id="tagInput" placeholder="${esc(I18n.t("f_add_tag"))}"/><button type="button" id="addTagBtn" class="btn-ghost">+</button></div><div class="row-tags">${tagChips}</div>`)}
    </div>
    <div class="form-actions">
      <label class="cb-row"><input type="checkbox" data-f="visible" ${draft.visible?'checked':''}/> <span>${esc(I18n.t("f_visibility"))}: <strong>${esc(draft.visible ? I18n.t("f_visible") : I18n.t("f_hidden"))}</strong></span></label>
      <div style="display:flex;gap:8px;">
        ${editing ? `<button type="button" class="btn-ghost" id="cancelEdit">${esc(I18n.t("f_cancel"))}</button>` : ""}
        <button type="submit" class="glow-btn">${esc(editing ? I18n.t("f_update") : I18n.t("f_save"))}</button>
      </div>
    </div>
  </form>`;
}

function tableView() {
  const products = Store.products;
  const catLabel = (v) => { const c = CATEGORIES.find(x => x.value === v); return c ? I18n.t(c.key) : v; };
  if (!products.length) {
    return `<div class="add-bar"><h1>${esc(I18n.t("dash_manage"))}</h1><button class="glow-btn" id="addBtn" style="padding:8px 16px;font-size:14px;">+ ${esc(I18n.t("dash_add"))}</button></div>
      <div class="glass empty">${esc(I18n.t("t_no_products"))}</div>`;
  }
  const rows = products.map(p => `<tr data-id="${p.id}">
    <td>${p.image ? `<img class="thumb" src="${esc(p.image)}"/>` : `<div class="thumb-placeholder"></div>`}</td>
    <td style="font-weight:500;color:var(--foreground);">${esc(p.name)}<div style="font-size:12px;color:var(--muted-foreground);">${esc(p.brand||"")}</div></td>
    <td style="color:var(--muted-foreground);">${esc(catLabel(p.category))}</td>
    <td style="white-space:nowrap;">${Number(p.price).toLocaleString()} <span style="font-size:12px;color:var(--muted-foreground);">${esc(p.currency)}</span></td>
    <td><input class="qty-input" type="number" min="0" value="${p.quantity}" data-qty="${p.id}"/></td>
    <td><div style="display:flex;flex-wrap:wrap;gap:4px;">${(p.tags||[]).map(tg=>`<span class="tag" style="color:${tg.color};border-color:${tg.color}66;background:${tg.color}1a;">${esc(tg.label)}</span>`).join("")}</div></td>
    <td><button class="toggle ${p.visible?'on':'off'}" data-vis="${p.id}"><span class="toggle-dot"></span></button></td>
    <td><button class="btn-edit" data-edit="${p.id}">${esc(I18n.t("t_edit"))}</button><button class="btn-del" data-del="${p.id}">${esc(I18n.t("t_delete"))}</button></td>
  </tr>`).join("");
  return `<div class="add-bar"><h1>${esc(I18n.t("dash_manage"))}</h1><button class="glow-btn" id="addBtn" style="padding:8px 16px;font-size:14px;">+ ${esc(I18n.t("dash_add"))}</button></div>
    <div class="glass table-wrap"><table class="products-table">
      <thead><tr>
        <th>${esc(I18n.t("t_thumb"))}</th><th>${esc(I18n.t("t_name"))}</th><th>${esc(I18n.t("t_cat"))}</th>
        <th>${esc(I18n.t("t_price"))}</th><th>${esc(I18n.t("t_stock"))}</th><th>${esc(I18n.t("t_tags"))}</th>
        <th>${esc(I18n.t("t_vis"))}</th><th>${esc(I18n.t("t_actions"))}</th>
      </tr></thead><tbody>${rows}</tbody>
    </table></div>
    ${confirmId ? `<div class="modal-overlay" id="confirmOverlay">
      <div class="modal glass">
        <p style="font-family:'Space Grotesk';font-size:18px;font-weight:600;">${esc(I18n.t("t_confirm_delete"))}</p>
        <div class="modal-actions">
          <button class="btn-ghost" id="noBtn">${esc(I18n.t("t_no"))}</button>
          <button class="btn-danger" id="yesBtn">${esc(I18n.t("t_yes"))}</button>
        </div>
      </div>
    </div>` : ""}`;
}

function render() {
  const items = [
    { id: "dashboard", label: I18n.t("dash_title") },
    { id: "add", label: editing ? I18n.t("dash_edit") : I18n.t("dash_add") },
    { id: "manage", label: I18n.t("dash_manage") },
  ];
  const aside = `<aside class="glass aside">
    <p class="aside-title">${esc(I18n.t("dash_title"))}</p>
    <nav class="aside-nav">
      ${items.map(it => `<button class="aside-link${view===it.id?' active':''}" data-view="${it.id}">${esc(it.label)}</button>`).join("")}
      <button class="aside-logout" id="sideLogout">${esc(I18n.t("nav_logout"))}</button>
    </nav>
  </aside>`;
  let main = "";
  if (view === "dashboard") main = dashboardView();
  else if (view === "add") main = formView();
  else if (view === "manage") main = tableView();
  document.body.innerHTML = `${renderNavbar()}<main class="admin-wrap">${aside}<section class="admin-main dash-section">${main}</section></main>`;
  bindAll();
}

function bindAll() {
  $$(".lang-btn").forEach(b => b.addEventListener("click", () => I18n.set(b.dataset.lang)));
  $("#logoutBtn")?.addEventListener("click", () => { Auth.logout(); location.href = "index.html"; });
  $("#sideLogout")?.addEventListener("click", () => { Auth.logout(); location.href = "index.html"; });
  $$(".aside-link").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.view !== "add") editing = null;
    if (b.dataset.view === "add" && !editing) draft = emptyDraft();
    view = b.dataset.view;
    render();
  }));

  // form
  const form = $("#pform");
  if (form) {
    $$("[data-f]", form).forEach(el => {
      el.addEventListener("input", () => {
        const k = el.dataset.f;
        let v = el.type === "checkbox" ? el.checked : el.value;
        if (el.type === "number") v = Number(v);
        draft[k] = v;
        if (k === "category" || k === "visible") render();
      });
    });
    $$("[data-storage]", form).forEach(b => b.addEventListener("click", () => {
      const s = b.dataset.storage;
      draft.storage = draft.storage.includes(s) ? draft.storage.filter(x => x !== s) : [...draft.storage, s];
      render();
    }));
    $$("[data-rm-color]", form).forEach(b => b.addEventListener("click", () => {
      draft.colors = draft.colors.filter(x => x !== b.dataset.rmColor); render();
    }));
    $$("[data-rm-tag]", form).forEach(b => b.addEventListener("click", () => {
      const i = Number(b.dataset.rmTag); draft.tags = draft.tags.filter((_, idx) => idx !== i); render();
    }));
    const colorInput = $("#colorInput");
    const addColor = () => { const v = colorInput.value.trim(); if (v && !draft.colors.includes(v)) { draft.colors.push(v); render(); } };
    colorInput?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addColor(); } });
    $("#addColorBtn")?.addEventListener("click", addColor);
    const tagInput = $("#tagInput");
    const addTag = () => { const v = tagInput.value.trim(); if (!v) return; const color = TAG_PALETTE[draft.tags.length % TAG_PALETTE.length]; draft.tags.push({ label: v, color }); render(); };
    tagInput?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } });
    $("#addTagBtn")?.addEventListener("click", addTag);
    $("#imgInput")?.addEventListener("change", e => {
      const file = e.target.files?.[0]; if (!file) return;
      const r = new FileReader(); r.onload = () => { draft.image = r.result; render(); }; r.readAsDataURL(file);
    });
    $("#cancelEdit")?.addEventListener("click", () => { editing = null; draft = emptyDraft(); view = "manage"; render(); });
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!draft.name.trim()) return;
      if (editing) { Store.update(editing.id, draft); editing = null; }
      else Store.add(draft);
      draft = emptyDraft();
      view = "manage";
      render();
    });
  }

  // table
  $("#addBtn")?.addEventListener("click", () => { editing = null; draft = emptyDraft(); view = "add"; render(); });
  $$("[data-qty]").forEach(el => el.addEventListener("change", () => Store.setQuantity(el.dataset.qty, Number(el.value))));
  $$("[data-vis]").forEach(el => el.addEventListener("click", () => { Store.toggleVisibility(el.dataset.vis); render(); }));
  $$("[data-edit]").forEach(el => el.addEventListener("click", () => {
    const p = Store.products.find(x => x.id === el.dataset.edit);
    if (!p) return;
    editing = p; const { id, createdAt, ...rest } = p; draft = { ...emptyDraft(), ...rest };
    view = "add"; render();
  }));
  $$("[data-del]").forEach(el => el.addEventListener("click", () => { confirmId = el.dataset.del; render(); }));
  $("#noBtn")?.addEventListener("click", () => { confirmId = null; render(); });
  $("#yesBtn")?.addEventListener("click", () => { Store.remove(confirmId); confirmId = null; render(); });
  $("#confirmOverlay")?.addEventListener("click", e => { if (e.target.id === "confirmOverlay") { confirmId = null; render(); } });
}

I18n.onChange(render);
Store.onChange(() => { if (view !== "add") render(); });
render();
})();
