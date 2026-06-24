(function(){
// NexCell HT™ — localStorage product + auth layer
const PRODUCTS_KEY = "nexcell_products";
const UPDATE_EVENT = "nexcell_products_updated";
const AUTH_KEY = "nexcell_admin_auth";
const ADMIN_PASSWORD = "N3xC3ll@HT#Secure!";

function readProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function writeProducts(items) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(36).slice(2));

const Store = {
  listeners: new Set(),
  products: [],
  init() {
    this.products = readProducts();
    const handler = () => { this.products = readProducts(); this.listeners.forEach(fn => fn()); };
    window.addEventListener(UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);
  },
  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  add(p) {
    const item = { ...p, id: uid(), createdAt: Date.now() };
    this.products = [item, ...this.products];
    writeProducts(this.products);
  },
  update(id, p) {
    this.products = this.products.map(x => x.id === id ? { ...x, ...p, id, createdAt: x.createdAt } : x);
    writeProducts(this.products);
  },
  remove(id) {
    this.products = this.products.filter(x => x.id !== id);
    writeProducts(this.products);
  },
  setQuantity(id, qty) {
    this.products = this.products.map(x => {
      if (x.id !== id) return x;
      const status = qty <= 0 ? "out" : qty <= 3 ? "low" : (x.status === "out" ? "in" : x.status);
      return { ...x, quantity: qty, status };
    });
    writeProducts(this.products);
  },
  toggleVisibility(id) {
    this.products = this.products.map(x => x.id === id ? { ...x, visible: !x.visible } : x);
    writeProducts(this.products);
  }
};
Store.init();

const Auth = {
  isAuthed() { return localStorage.getItem(AUTH_KEY) === "true"; },
  login(pw) {
    if (pw === ADMIN_PASSWORD) { localStorage.setItem(AUTH_KEY, "true"); return true; }
    return false;
  },
  logout() { localStorage.removeItem(AUTH_KEY); }
};

window.NexCell = window.NexCell || {};
window.NexCell.Store = Store;
window.NexCell.Auth = Auth;
})();
