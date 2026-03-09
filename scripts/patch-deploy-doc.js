const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "DEPLOY-HOSTINGER.md");
let s = fs.readFileSync(filePath, "utf8");

// Normalize line endings and Unicode apostrophe so we can match
s = s.replace(/\r\n/g, "\n").replace(/\u2019/g, "'");

const oldBlock = `- **Port:** Next.js runs on port \`3000\`. In Hostinger's Node.js app settings, set **Application port** (or similar) to \`3000\` unless they give you another port.
- **Start command:** If Hostinger asks for a start command, use: \`npm start\` or \`node node_modules/next/dist/bin/next start\`.

---

## 6. Build on server (if you deploy via Git)

If you only upload source (no \`.next\`), run the build on the server after clone/upload:

\`\`\`bash
# Set base path if using subpath (optional)
# export NEXT_PUBLIC_BASE_PATH="/travel"

npm ci
npm run build
npm start
\`\`\`

In Hostinger's Node.js / Git UI, set:

- **Build command:** \`npm run build\` (or \`npm ci && npm run build\`)
- **Start command:** \`npm start\``;

const newBlock = `- **Port:** Next.js runs on port \`3000\`. In Hostinger Node.js app settings, set **Application port** to \`3000\`.
- **Start command:** \`npm start\` (or \`node node_modules/next/dist/bin/next start\`).

If you use **Git** on Hostinger, set in the Node.js / Git UI:

- **Build command:** \`npm ci && npm run build\`
- **Start command:** \`npm start\``;

const r1 = s.replace(oldBlock, newBlock);
if (r1 !== s) s = r1;

const oldChecklist = `## 7. Checklist

- [ ] Built locally with \`npm run build\` (and \`NEXT_PUBLIC_BASE_PATH\` if using subpath).
- [ ] Uploaded project **without** \`node_modules\`.
- [ ] Set \`NEXT_PUBLIC_BASE_PATH\` on Hostinger if you use a subpath.
- [ ] Ran \`npm ci\` (or \`npm install\`) on the server.
- [ ] Ran \`npm run build\` on server if you didn't upload \`.next\`.
- [ ] Started app with \`npm start\` and set application port to \`3000\` in Hostinger.`;

const newChecklist = `## 6. Checklist (small-upload)

- [ ] Zipped/uploaded **source only** — no \`node_modules\`, no \`.next\`.
- [ ] Set \`NEXT_PUBLIC_BASE_PATH\` on Hostinger if you use a subpath.
- [ ] On server: \`npm ci\` → \`npm run build\` → \`npm start\`.
- [ ] Application port set to \`3000\` in Hostinger.`;

const r2 = s.replace(oldChecklist, newChecklist);
if (r2 !== s) s = r2;

fs.writeFileSync(filePath, s);
console.log("Patched DEPLOY-HOSTINGER.md");
