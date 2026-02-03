const fs = require("fs");
const path = require("path");

const products = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "products.json"), "utf8")
);

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function parseTableRows(html) {
  const rows = {};
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const tds = [...trMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (tds.length >= 2) {
      const label = decodeEntities(tds[0][1].replace(/<[^>]+>/g, "")).trim();
      const value = decodeEntities(tds[1][1].replace(/<[^>]+>/g, "")).trim();
      rows[label.toLowerCase()] = value;
    }
  }
  return rows;
}

function getTableValue(rows, ...keys) {
  for (const key of keys) {
    if (rows[key.toLowerCase()]) return rows[key.toLowerCase()];
  }
  return "";
}

function extractDescription(html) {
  const cleaned = decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(div|p)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  );

  return cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .reduce((paragraphs, line) => {
      if (paragraphs.length === 0) {
        paragraphs.push(line);
      } else {
        const last = paragraphs[paragraphs.length - 1];
        if (last.length < 80) {
          paragraphs.push(line);
        } else {
          paragraphs[paragraphs.length - 1] = last + " " + line;
        }
      }
      return paragraphs;
    }, []);
}

function extractTitle(name) {
  const parts = name.split(" | ");
  return parts[0].trim();
}

function extractSupplier(product) {
  if (product.categories && product.categories.length > 0) {
    return product.categories[0].name;
  }
  return "";
}

const extracted = products.map((product) => {
  const tableRows = parseTableRows(product.short_description || "");

  return {
    title: extractTitle(product.name),
    images: (product.images || []).map((img) => img.src),
    description: extractDescription(product.description || ""),
    price: Number(product.price),
    inStock: product.stock_status === "instock",
    type: getTableValue(
      tableRows,
      "Variety",
      "Indica/Sativa Genotype",
      "Indica / Sativa",
      "Sat/Ind",
      "Strain Type"
    ),
    tac: getTableValue(tableRows, "TAC", "THC", "THC / TAC"),
    length: getTableValue(tableRows, "Height", "Height Indoor", "Plant Height Outdoors"),
    yield: getTableValue(tableRows, "Yield", "Yield Indoor", "Yield Indoors", "Indoor Yield"),
    floweringTime: getTableValue(
      tableRows,
      "Flowering Time",
      "Flowering time",
      "Flowering Time Indoor",
      "Indoor Flowering"
    ),
    terpeneProfile: getTableValue(
      tableRows,
      "Terpene Profile / Flavours",
      "Terpene Profile",
      "Flavours",
      "Flavour",
      "Flavors",
      "Flavor",
      "Taste",
      "Aroma"
    ),
    effects: getTableValue(tableRows, "Effect", "Effects & Benefits", "Medicinal"),
    supplier: extractSupplier(product),
    dateCreated: product.date_created,
  };
});

extracted.sort((a, b) => (b.dateCreated > a.dateCreated ? 1 : -1));

fs.writeFileSync(
  path.resolve(__dirname, "extracted-products.json"),
  JSON.stringify(extracted, null, 2)
);

console.log(`Extracted ${extracted.length} products to extracted-products.json`);
