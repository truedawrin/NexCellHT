(function(){
// NexCell HT™ i18n
const LANGS = [
  { code: "fr", label: "Français" },
  { code: "kr", label: "Kreyòl" },
  { code: "en", label: "English" },
];

const TRANSLATIONS = {
  nav_admin: { fr: "Admin", kr: "Admin", en: "Admin" },
  nav_home: { fr: "Accueil", kr: "Akèy", en: "Home" },
  nav_back_to_store: { fr: "Retour à la boutique", kr: "Tounen nan boutik la", en: "Back to store" },
  nav_logout: { fr: "Déconnexion", kr: "Dekonekte", en: "Log out" },
  hero_title: { fr: "La Technologie de Demain, Disponible Aujourd'hui", kr: "Teknoloji Demen an, Disponib Jodi a", en: "Tomorrow's Technology, Available Today" },
  hero_subtitle: { fr: "iPhone · Android · Tablettes · Accessoires Premium", kr: "iPhone · Android · Tablèt · Akseswa Premye Klas", en: "iPhone · Android · Tablets · Premium Accessories" },
  hero_cta: { fr: "Explorer les Produits", kr: "Eksplore Pwodwi yo", en: "Explore Products" },
  cat_all: { fr: "Tous", kr: "Tout", en: "All" },
  cat_iphone: { fr: "iPhones", kr: "iPhone", en: "iPhones" },
  cat_android: { fr: "Android", kr: "Android", en: "Android" },
  cat_tablet: { fr: "Tablettes", kr: "Tablèt", en: "Tablets" },
  cat_audio: { fr: "Écouteurs & AirPods", kr: "Ekoutè & AirPods", en: "Headphones & AirPods" },
  cat_case: { fr: "Coques", kr: "Boutèy", en: "Cases" },
  cat_charger: { fr: "Chargeurs", kr: "Chajè", en: "Chargers" },
  cat_screen: { fr: "Protège-Écrans", kr: "Pwoteksyon Ekran", en: "Screen Protectors" },
  cat_powerbank: { fr: "Batteries Portatives", kr: "Batri Pòtatif", en: "Power Banks" },
  cat_other: { fr: "Autre", kr: "Lòt", en: "Other" },
  stock_in: { fr: "En Stock", kr: "Disponib", en: "In Stock" },
  stock_low: { fr: "Stock Limité", kr: "Stock Limite", en: "Low Stock" },
  stock_out: { fr: "Épuisé", kr: "Fini", en: "Sold Out" },
  order_whatsapp: { fr: "Commander via WhatsApp", kr: "Kòmande sou WhatsApp", en: "Order via WhatsApp" },
  no_products: { fr: "Aucun produit dans cette catégorie.", kr: "Pa gen pwodwi nan kategori sa a.", en: "No products in this category." },
  why_title: { fr: "Pourquoi Choisir NexCell HT™ ?", kr: "Poukisa Chwazi NexCell HT™ ?", en: "Why Choose NexCell HT™?" },
  stat_clients: { fr: "Clients Satisfaits", kr: "Kliyan Satisfè", en: "Happy Clients" },
  stat_sold: { fr: "Produits Vendus", kr: "Pwodwi Vann", en: "Products Sold" },
  stat_authentic: { fr: "Produits Authentiques", kr: "Pwodwi Otantik", en: "Authentic Products" },
  stat_delivery: { fr: "Livraison Rapide", kr: "Livrezon Rapid", en: "Fast Delivery" },
  feat_original: { fr: "Produits 100% Originaux", kr: "Pwodwi 100% Orijinal", en: "100% Original Products" },
  feat_delivery: { fr: "Livraison Rapide", kr: "Livrezon Rapid", en: "Fast Delivery" },
  feat_support: { fr: "Support WhatsApp 7j/7", kr: "Sipò WhatsApp 7j/7", en: "WhatsApp Support 7/7" },
  feat_price: { fr: "Meilleurs Prix du Marché", kr: "Pi Bon Pri sou Mache a", en: "Best Prices on the Market" },
  admin_login_title: { fr: "Accès Administrateur", kr: "Aksè Administratè", en: "Admin Access" },
  admin_password_label: { fr: "Mot de passe", kr: "Modpas", en: "Password" },
  admin_login_btn: { fr: "Se connecter", kr: "Konekte", en: "Log in" },
  admin_login_error: { fr: "Mot de passe incorrect.", kr: "Modpas la pa kòrèk.", en: "Incorrect password." },
  admin_cancel: { fr: "Annuler", kr: "Anile", en: "Cancel" },
  dash_title: { fr: "Tableau de Bord", kr: "Tablodbò", en: "Dashboard" },
  dash_products: { fr: "Produits", kr: "Pwodwi", en: "Products" },
  dash_add: { fr: "Ajouter un Produit", kr: "Ajoute Pwodwi", en: "Add Product" },
  dash_edit: { fr: "Modifier le Produit", kr: "Modifye Pwodwi a", en: "Edit Product" },
  dash_manage: { fr: "Gérer les Produits", kr: "Jere Pwodwi yo", en: "Manage Products" },
  stat_total: { fr: "Total Produits", kr: "Total Pwodwi", en: "Total Products" },
  stat_in_stock: { fr: "En Stock", kr: "Disponib", en: "In Stock" },
  stat_out_stock: { fr: "Épuisés", kr: "Fini", en: "Sold Out" },
  stat_promo: { fr: "En Promo", kr: "Nan Pwomosyon", en: "On Promo" },
  stat_cats: { fr: "Catégories", kr: "Kategori", en: "Categories" },
  f_name: { fr: "Nom du produit", kr: "Non pwodwi a", en: "Product name" },
  f_category: { fr: "Catégorie", kr: "Kategori", en: "Category" },
  f_brand: { fr: "Marque", kr: "Mak", en: "Brand" },
  f_storage: { fr: "Capacité de stockage", kr: "Kapasite stokaj", en: "Storage capacity" },
  f_colors: { fr: "Couleurs disponibles", kr: "Koulè ki disponib", en: "Available colors" },
  f_add_color: { fr: "Ajouter une couleur (Entrée)", kr: "Ajoute yon koulè (Enter)", en: "Add a color (Enter)" },
  f_ram: { fr: "RAM (optionnel)", kr: "RAM (opsyonèl)", en: "RAM (optional)" },
  f_condition: { fr: "État", kr: "Kondisyon", en: "Condition" },
  f_new: { fr: "Neuf", kr: "Nèf", en: "New" },
  f_refurb: { fr: "Reconditionné", kr: "Rekondisyone", en: "Refurbished" },
  f_compat: { fr: "Notes de compatibilité", kr: "Nòt konpatibilite", en: "Compatibility notes" },
  f_price: { fr: "Prix", kr: "Pri", en: "Price" },
  f_currency: { fr: "Devise", kr: "Lajan", en: "Currency" },
  f_qty: { fr: "Quantité en stock", kr: "Kantite nan stock", en: "Stock quantity" },
  f_status: { fr: "Statut du stock", kr: "Estati stock", en: "Stock status" },
  f_image: { fr: "Image du produit", kr: "Imaj pwodwi a", en: "Product image" },
  f_tags: { fr: "Tags personnalisés", kr: "Tag pèsonalize", en: "Custom tags" },
  f_add_tag: { fr: "Tapez un tag puis Entrée", kr: "Tape yon tag epi Enter", en: "Type a tag then Enter" },
  f_visibility: { fr: "Visibilité", kr: "Vizibilite", en: "Visibility" },
  f_visible: { fr: "Visible", kr: "Vizib", en: "Visible" },
  f_hidden: { fr: "Masqué", kr: "Kache", en: "Hidden" },
  f_save: { fr: "Enregistrer", kr: "Anrejistre", en: "Save" },
  f_update: { fr: "Mettre à jour", kr: "Mete ajou", en: "Update" },
  f_cancel: { fr: "Annuler", kr: "Anile", en: "Cancel" },
  f_specs: { fr: "Spécifications de l'appareil", kr: "Spesifikasyon aparèy la", en: "Device Specs" },
  t_thumb: { fr: "Image", kr: "Imaj", en: "Image" },
  t_name: { fr: "Nom", kr: "Non", en: "Name" },
  t_cat: { fr: "Catégorie", kr: "Kategori", en: "Category" },
  t_price: { fr: "Prix", kr: "Pri", en: "Price" },
  t_stock: { fr: "Stock", kr: "Stock", en: "Stock" },
  t_tags: { fr: "Tags", kr: "Tag", en: "Tags" },
  t_vis: { fr: "Visibilité", kr: "Vizibilite", en: "Visibility" },
  t_actions: { fr: "Actions", kr: "Aksyon", en: "Actions" },
  t_edit: { fr: "Modifier", kr: "Modifye", en: "Edit" },
  t_delete: { fr: "Supprimer", kr: "Efase", en: "Delete" },
  t_confirm_delete: { fr: "Confirmer la suppression ?", kr: "Konfime efasman an ?", en: "Confirm deletion?" },
  t_yes: { fr: "Oui", kr: "Wi", en: "Yes" },
  t_no: { fr: "Non", kr: "Non", en: "No" },
  t_no_products: { fr: "Aucun produit pour le moment.", kr: "Pa gen pwodwi pou kounye a.", en: "No products yet." },
  footer_rights: { fr: "Tous droits réservés.", kr: "Tout dwa rezève.", en: "All rights reserved." },
};

const CATEGORIES = [
  { value: "iphone", key: "cat_iphone" },
  { value: "android", key: "cat_android" },
  { value: "tablet", key: "cat_tablet" },
  { value: "audio", key: "cat_audio" },
  { value: "case", key: "cat_case" },
  { value: "charger", key: "cat_charger" },
  { value: "screen", key: "cat_screen" },
  { value: "powerbank", key: "cat_powerbank" },
  { value: "other", key: "cat_other" },
];

const SPEC_CATEGORIES = ["iphone", "android", "tablet", "audio"];
const TAG_PALETTE = ["#0A84FF","#00E5FF","#FF4D6D","#FFA630","#2BD67B","#B388FF","#FF6BD6","#F5D547"];
const LANG_KEY = "nexcell_lang";

const I18n = {
  lang: "fr",
  listeners: new Set(),
  init() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "fr" || saved === "kr" || saved === "en") this.lang = saved;
  },
  set(l) {
    this.lang = l;
    localStorage.setItem(LANG_KEY, l);
    this.listeners.forEach(fn => fn());
  },
  t(key) {
    const entry = TRANSLATIONS[key];
    return entry ? entry[this.lang] : key;
  },
  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
};
I18n.init();

window.NexCell = window.NexCell || {};
window.NexCell.I18n = I18n;
window.NexCell.LANGS = LANGS;
window.NexCell.CATEGORIES = CATEGORIES;
window.NexCell.SPEC_CATEGORIES = SPEC_CATEGORIES;
window.NexCell.TAG_PALETTE = TAG_PALETTE;
})();
