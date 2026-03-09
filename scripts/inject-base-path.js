/**
 * When building for a subpath, prefixes asset URLs in app/globals.css with NEXT_PUBLIC_BASE_PATH.
 * Run before `next build`. When NEXT_PUBLIC_BASE_PATH is unset (root deployment), no change is made.
 */
const fs = require("fs");
const path = require("path");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const globalsPath = path.join(__dirname, "..", "app", "globals.css");
let content = fs.readFileSync(globalsPath, "utf8");

if (basePath) {
  // Prefix root paths so they work when deployed under a subpath
  content = content.replace(/url\("\/fonts\//g, `url("${basePath}/fonts/`);
  content = content.replace(/url\("\/home\//g, `url("${basePath}/home/`);
  content = content.replace(/url\("\/footer\//g, `url("${basePath}/footer/`);
  fs.writeFileSync(globalsPath, content);
  console.log("Injected basePath into globals.css:", basePath);
} else {
  console.log("NEXT_PUBLIC_BASE_PATH not set, using root paths (no change).");
}
