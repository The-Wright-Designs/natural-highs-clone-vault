const fs = require("fs");
const path = require("path");

const DATA_PATH = path.resolve(__dirname, "extracted-products.json");
const IMAGES_DIR = path.resolve(__dirname, "images");
const CONCURRENCY = 10;

function slugify(title) {
  const SUFFIXES = ["RBX2", "RBX1", "RBX", "R1", "R2", "R3", "S1", "Seed", "Strain", "Feminized", "Feminised"];

  let s = title;
  s = s.replace(/\([^)]*\)/g, "");
  s = s.replace(/'/g, "");
  s = s.replace(/&/g, "-");
  s = s.replace(/#/g, "");
  s = s.trim();

  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of SUFFIXES) {
      const regex = new RegExp("\\b" + suffix + "\\s*$", "i");
      if (regex.test(s)) {
        s = s.replace(regex, "").trim();
        changed = true;
      }
    }
  }

  s = s.toLowerCase();
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");
  s = s.replace(/-+/g, "-");
  s = s.replace(/^-|-$/g, "");
  return s;
}

(async () => {
  const products = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
  }

  let moved = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];
  const productResults = products.map(() => []);

  const tasks = products.map((product, productIndex) => async () => {
    const slug = slugify(product.title);
    const productDir = path.resolve(IMAGES_DIR, slug);

    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir);
    }

    const uniqueImages = [...new Set(product.images)];
    let seq = 1;

    for (const imgPath of uniqueImages) {
      const ext = path.extname(imgPath);
      const srcPath = path.resolve(IMAGES_DIR, path.basename(imgPath));
      const newFilename = `${slug}-${seq}${ext}`;
      const destPath = path.resolve(productDir, newFilename);

      if (fs.existsSync(destPath)) {
        console.log(`[SKIPPED] ${slug}/${newFilename}`);
        skipped++;
        productResults[productIndex].push(`./images/${slug}/${newFilename}`);
        seq++;
        continue;
      }

      try {
        console.log(`[MOVING] ${slug}/${newFilename}`);
        fs.renameSync(srcPath, destPath);
        console.log(`[OK] ${slug}/${newFilename}`);
        moved++;
        productResults[productIndex].push(`./images/${slug}/${newFilename}`);
      } catch (err) {
        failed++;
        failures.push({ product: product.title, file: newFilename, error: err.message });
        console.log(`[FAILED] ${slug}/${newFilename} — ${err.message}`);
      }
      seq++;
    }
  });

  let index = 0;
  async function worker() {
    while (index < tasks.length) {
      const task = tasks[index++];
      await task();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, () => worker())
  );

  console.log("\n--- SUMMARY ---");
  console.log(`Moved:    ${moved}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);
  if (failures.length) {
    console.log("\nFailed files:");
    failures.forEach((f) => console.log(`  ${f.product}: ${f.file} — ${f.error}`));
  }

  if (moved === 0 && skipped === 0) {
    console.log("\nNothing moved. Not updating extracted-products.json.");
    return;
  }

  const updatedProducts = products.map((product, i) => ({
    ...product,
    images: productResults[i].length > 0 ? productResults[i] : product.images,
  }));

  fs.writeFileSync(DATA_PATH, JSON.stringify(updatedProducts, null, 2));
  console.log("\nUpdated extracted-products.json with local paths.");
})();
