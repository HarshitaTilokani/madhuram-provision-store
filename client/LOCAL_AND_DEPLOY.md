# Madhuram Provision Store — Frontend (Local + Deploy)

## Requirements
- Node.js 20+ (LTS)
- VS Code (recommended)
- Backend API running (or use seed + server)

---

## 1. Run in VS Code (Local)

```bash
# Open this folder in VS Code:
# madhuram-provision-store/client

cd client
npm install
npm run dev
```

Open: http://localhost:5173

### Local API proxy
Vite proxies `/api` → `http://localhost:5000`.  
Start the backend first:

```bash
cd ../server
cp .env.example .env
# Edit MONGODB_URI if needed
npm install
npm run seed    # optional DEMO products
npm run dev     # port 5000
```

---

## 2. Build for production (ready to publish)

```bash
cd client

# Optional: set your live API URL
# Create .env.production:
# VITE_API_URL=https://api.yourdomain.com/api

npm run build
```

Output folder: **`client/dist/`**

This `dist/` folder is what you upload to any static host or Nginx.

---

## 3. Deploy frontend on your server

### Option A — Nginx (VPS)

```bash
# On server
sudo mkdir -p /var/www/madhuram
# Upload contents of client/dist/ into /var/www/madhuram/

# Nginx example:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/madhuram;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: proxy API if backend is on same server
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then enable SSL with Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option B — Vercel / Netlify / Cloudflare Pages

1. Connect GitHub repo (or upload `dist`)
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_URL=https://your-api-url/api`

### Option C — Same server as Express

In production, Express can serve the SPA:

```js
// server production only
import path from 'path'
app.use(express.static(path.join(__dirname, '../../client/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})
```

---

## 4. Environment variables (frontend)

| Variable | Local | Production |
|----------|-------|------------|
| `VITE_API_URL` | empty (uses proxy `/api`) | `https://api.yourdomain.com/api` |

Create `client/.env.production` before `npm run build` if API is on another domain.

---

## 5. Project structure (frontend only)

```
client/
├── public/favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/   (Header, Footer, AnnouncementBar)
│   │   └── ui/       (ProductCard)
│   ├── layouts/MainLayout.tsx
│   ├── pages/        (Home, Shop, Product, Cart, Auth, About, Contact...)
│   ├── services/api.ts
│   ├── store/        (auth, cart, wishlist)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css     (Tailwind + design tokens)
├── index.html
├── vite.config.ts
├── package.json
└── .env.example
```

---

## 6. After first deploy

1. Point domain DNS to your server / Vercel
2. Set backend `CLIENT_URL` to your frontend URL
3. Set Razorpay webhook to `https://api.../api/payments/webhook` (when ready)
4. Replace DEMO products via admin when backend admin is live
