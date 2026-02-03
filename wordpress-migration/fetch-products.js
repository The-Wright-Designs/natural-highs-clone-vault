const fs = require("fs");
const path = require("path");

const envLines = fs
  .readFileSync(path.resolve(__dirname, "..", ".env.local"), "utf8")
  .split("\n");
const env = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
}

const auth =
  "Basic " +
  Buffer.from(`${env.WP_CONSUMER_KEY}:${env.WP_CONSUMER_SECRET}`).toString(
    "base64"
  );

(async () => {
  const products = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://www.naturalhighs.co.za/wp-json/wc/v3/products?per_page=100&page=${page}`,
      { headers: { Authorization: auth } }
    );
    const data = await res.json();
    if (!data.length) break;
    products.push(...data);
    page++;
  }

  fs.writeFileSync(
    path.resolve(__dirname, "products.json"),
    JSON.stringify(products, null, 2)
  );
})();
