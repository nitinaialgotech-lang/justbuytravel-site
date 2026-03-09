/**
 * After a subpath build, restores root paths in app/globals.css so the repo stays ready for any deployment.
 */
const fs = require("fs");
const path = require("path");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const globalsPath = path.join(__dirname, "..", "app", "globals.css");

if (!basePath) {
  console.log("NEXT_PUBLIC_BASE_PATH not set, nothing to restore.");
  process.exit(0);
}

let content = fs.readFileSync(globalsPath, "utf8");
const escaped = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

content = content.replace(new RegExp(`url\\("${escaped}/fonts/`, "g"), 'url("/fonts/');
content = content.replace(new RegExp(`url\\("${escaped}/home/`, "g"), 'url("/home/');
content = content.replace(new RegExp(`url\\("${escaped}/footer/`, "g"), 'url("/footer/');

fs.writeFileSync(globalsPath, content);
console.log("Restored root paths in globals.css");
