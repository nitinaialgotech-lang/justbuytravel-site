# Build & Upload Process — Hostinger (Node.js)

## Small-upload workflow (recommended)

**What you were doing:** Upload **source only** (no `.next`, no `node_modules`), then **build on the server**. That is the right way to keep upload size low.

- **Upload:** Source code + `public/` + config files only.
- **On server:** `npm ci` → `npm run build` → `npm start`.
- **Build type:** Build runs on Hostinger, so you don't need to upload the large `.next` folder.

---

## 1. What to upload (keep zip small)

Upload **only** these (never `.next` or `node_modules`):

| Include | Purpose |
|--------|---------|
| `public/` | Static files (images, fonts, etc.) |
| `app/` | App router pages & layout |
| `Components/`, `component/`, `context/` | React components |
| `scripts/` | Base-path inject/restore scripts |
| `style/` | Extra styles |
| `package.json` | Dependencies & scripts |
| `package-lock.json` | Locked versions |
| `next.config.mjs` | Next.js config |
| `postcss.config.mjs`, `jsconfig.json` | Build tooling |

**Do not include in your zip/upload:**

- `node_modules/` (very large — install on server)
- `.next/` (build output — created on server)
- `.git/` (optional, saves space)
- `*.zip`, `node_modules`, `.next` (often accidentally included when zipping the whole folder)

### Creating a small zip (Windows)

1. **Option A:** Zip only the folders/files from the table above (no parent folder that contains `node_modules` or `.next`).
2. **Option B:** From project root, exclude big folders when zipping (e.g. in 7-Zip: right‑click → 7-Zip → Add to archive, then exclude `node_modules`, `.next`, `.git`).

If your zip is still large, check that `node_modules` and `.next` are **not** inside the zip (they are the usual cause).

---

## 2. Local build (only if you need to test before upload)

You **do not** need to build locally for the small-upload workflow. Build on the server.

If you want to test the production build on your PC:

### Deploy at site root

```powershell
cd D:\justbuytravel
npm run build
```

### Deploy in a subpath (e.g. `/travel`)

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/travel"
npm run build
```

---

## 3. Upload methods (FTP / File Manager / zip)

### A. File Manager / FTP (e.g. FileZilla)

1. Connect to Hostinger (FTP or File Manager in hPanel).
2. Go to the folder where Node.js runs (often `domains/yourdomain.com/public_html` or a subfolder Hostinger assigns for Node).
3. Upload all items from the list above (no `node_modules`).
4. If Hostinger expects the app in a specific directory (e.g. `public_html` or `node_app`), use that.

### B. Git (if Hostinger supports it)

1. Push your code to GitHub/GitLab (add `node_modules` and `.env*.local` to `.gitignore`).
2. In Hostinger (hPanel) open **Advanced** → **Git** (or **Node.js** section).
3. Clone the repo into the app directory.
4. Set build command and start command (see step 5).

---

## 4. Environment variables on Hostinger

In hPanel → your domain / Node.js app → **Environment variables** (or `.env` in the app folder), set:

- **Root deploy:**  
  - No `NEXT_PUBLIC_BASE_PATH` (or leave empty).
- **Subpath deploy (e.g. `/travel`):**  
  - `NEXT_PUBLIC_BASE_PATH=/travel`

Add any other variables your app needs (API URLs, keys, etc.).

---

## 5. On Hostinger: install, build, and run (small-upload workflow)

Because you upload **source only** (no `.next`), you build on the server:

```bash
# Go to project directory (path may differ on Hostinger)
cd /path/to/your/app

# Install dependencies (no node_modules in your upload)
npm ci

# Build on server (creates .next here)
npm run build

# Start the app
npm start
```

- **Port:** Next.js runs on port `3000`. In Hostinger Node.js app settings, set **Application port** to `3000`.
- **Start command:** `npm start` (or `node node_modules/next/dist/bin/next start`).

If you use **Git** on Hostinger, set in the Node.js / Git UI:

- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start`

---

## 6. Checklist (small-upload)

- [ ] Zipped/uploaded **source only** — no `node_modules`, no `.next`.
- [ ] Set `NEXT_PUBLIC_BASE_PATH` on Hostinger if you use a subpath.
- [ ] On server: `npm ci` → `npm run build` → `npm start`.
- [ ] Application port set to `3000` in Hostinger.

---

## Troubleshooting: 404 and ERR_TOO_MANY_REDIRECTS

- **404 on blog detail pages** (`/blog/my-post` or `/category/my-post`):
  1. The app must be running with **`npm start`** (Node.js). Blog detail pages are rendered on the server; if you only upload files and the host serves them statically (no Node process), blog URLs will 404.
  2. Your web server (Nginx/Apache) must **proxy all requests** to the Next.js app (e.g. port 3000). If it looks for a file at `/blog/my-post` and returns 404 without forwarding to Node, fix the server config (see Nginx example in the doc).
  3. Blog content is fetched from `https://justbuytravel.in/wp-json/wp/v2`. If that URL is **blocked or fails from Hostinger** (firewall, security plugin), the page will 404. Fix: allow Hostinger’s server IP in WordPress/firewall, or **build on your PC** (where the API works), then upload the project **including the `.next` folder** and on the server run only **`npm start`** (do not run `npm run build` on Hostinger). Then blog pages are served from the pre-rendered build.
- **404 on place pages** (e.g. `/london-eye-ChIJ...`, `/sukhna-lake-ChIJ...`): The app uses a dynamic `[hotel]` route. If you see 404s for those URLs, ensure `app/[hotel]/page.js` has `dynamicParams: true` so paths not in `generateStaticParams` are handled at request time (this is set in the repo).
- **404 on `/book-hotels-online`**: The site redirects `/book-hotels-online` to `/hotels` in `next.config.mjs`. Rebuild after any config change.
- **ERR_TOO_MANY_REDIRECTS**: Usually a **basePath mismatch**. If the site is served at the **root** (e.g. `https://yourdomain.com/`), leave `NEXT_PUBLIC_BASE_PATH` **unset** on Hostinger. If you set `NEXT_PUBLIC_BASE_PATH` (e.g. `/travel`) but the domain or proxy serves the app at root, the browser and server can redirect each other in a loop. Fix: either remove `NEXT_PUBLIC_BASE_PATH` when at root, or ensure the app is actually served under that subpath and all links use it.

---

## Optional: Smaller deploy with standalone output

To deploy only the minimal files Next.js needs, you can use standalone output:

1. In `next.config.mjs` add:
   ```js
   const nextConfig = {
     reactStrictMode: true,
     output: "standalone",
     basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
   };
   ```
2. Build: `npm run build`.
3. On the server, run the standalone server:
   ```bash
   node .next/standalone/server.js
   ```
4. Copy `public/` into `.next/standalone/public` (or serve static files as per Hostinger's setup).

Use this only if you're comfortable adjusting Hostinger's start command and static file serving.

---

If you tell me whether you use **root** or **subpath** and **FTP/File Manager** or **Git**, I can narrow this to exact steps for your case.
