import fs from "fs";
import path from "path";

const locales = ["id", "en", "fr", "zh", "ja", "ko"];
const msgs = {};

locales.forEach((l) => {
  const filePath = path.join(process.cwd(), "messages", `${l}.json`);
  msgs[l] = JSON.parse(fs.readFileSync(filePath, "utf8"));
});

function getKeys(obj, prefix = "") {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const allKeySets = {};
const unionKeys = new Set();

locales.forEach((l) => {
  const kList = getKeys(msgs[l]);
  allKeySets[l] = new Set(kList);
  kList.forEach((k) => unionKeys.add(k));
});

console.log("Total unique keys across all messages:", unionKeys.size);

let hasMissing = false;
locales.forEach((l) => {
  const missing = [];
  unionKeys.forEach((k) => {
    if (!allKeySets[l].has(k)) {
      missing.push(k);
    }
  });
  if (missing.length > 0) {
    hasMissing = true;
    console.log(`Locale [${l}] is MISSING ${missing.length} keys:`, missing);
  } else {
    console.log(`Locale [${l}] has 100% parity (${allKeySets[l].size} keys)`);
  }
});

if (!hasMissing) {
  console.log("SUCCESS: PERFECT KEY PARITY ACROSS ALL 6 LOCALES!");
}
