NexCell HT™ — Static Website Bundle
====================================

CONTENTS
- index.html     : Storefront (homepage with hero, products, WhatsApp ordering)
- admin.html     : Password-protected admin panel
- assets/        : CSS, JS, i18n and store logic
- README.txt     : This file

HOW TO USE
1. Upload the entire folder to any static host (Netlify, Vercel, GitHub Pages,
   cPanel, OVH, Hostinger, Cloudflare Pages, etc.) OR open index.html directly
   in a browser to preview locally.
2. The homepage is at /index.html, the admin panel at /admin.html.

ADMIN ACCESS
- Click the lock icon (top right) on the homepage.
- Enter the password: N3xC3ll@HT#Secure!
- You will be redirected to the admin panel where you can add, edit,
  delete products, change stock, toggle visibility and upload images.

LANGUAGES
- French (default), Kreyòl, English — switcher is in the top navbar.

WHATSAPP ORDERS
- Every product's "Commander via WhatsApp" button opens a chat with
  +509 38422993 pre-filled with the product name and specs.

IMPORTANT NOTES
- All data (products + login session) is stored in the visitor's browser
  localStorage. Each device/browser keeps its own catalog.
- For a single shared catalog across all visitors and devices, the site
  would need a backend database (not included in this static export).
- The admin password is stored client-side, so anyone with access to the
  source files can read it. Change it before deploying publicly by
  editing the ADMIN_PASSWORD constant in assets/store.js.

© NexCell HT™ — Made for Haiti.
