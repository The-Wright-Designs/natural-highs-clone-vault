# WordPress Migration Scripts

This folder contains Node.js scripts to migrate product data and images from a WordPress WooCommerce store to this Next.js application.

## Overview

The migration process consists of three sequential steps:

1. **fetch-products.js** — Fetches product data from WordPress WooCommerce API
2. **extract-products.js** — Extracts and transforms product data into the format needed for this app
3. **download-images.js** — Organizes and manages product images

## Setup

### Prerequisites

- Node.js installed
- Environment variables configured in `.env.local` with WooCommerce API credentials:
  - `WP_CONSUMER_KEY` — Your WooCommerce REST API Consumer Key
  - `WP_CONSUMER_SECRET` — Your WooCommerce REST API Consumer Secret

### Getting API Credentials

1. Log into your WordPress admin panel
2. Go to WooCommerce → Settings → Advanced → REST API
3. Create a new API key with read/write access
4. Copy the Consumer Key and Consumer Secret to `.env.local`

## Step 1: Fetch Products

```bash
node fetch-products.js
```

**What it does:**
- Connects to the WordPress WooCommerce REST API using your credentials
- Fetches all products in pages of 100
- Saves the raw product data to `products.json`

**Output:**
- `products.json` — Raw WooCommerce product data

**Notes:**
- The script automatically handles pagination
- All product information is preserved at this stage

## Step 2: Extract Products

```bash
node extract-products.js
```

**What it does:**
- Reads the raw `products.json` file
- Parses HTML tables from product descriptions
- Transforms data into the app's product format
- Extracts product attributes like:
  - Title (strips supplier suffix)
  - Description (cleans HTML and formats into paragraphs)
  - Price
  - Stock status
  - Product type (Indica/Sativa)
  - TAC/THC content
  - Plant height
  - Yield
  - Flowering time
  - Terpene profile
  - Effects
  - Supplier (from product category)
- Sorts products by creation date (newest first)

**Output:**
- `extracted-products.json` — Cleaned and formatted product data

**Notes:**
- The script handles multiple field name variations (e.g., "THC" vs "TAC", "Flowering Time" vs "Flowering time")
- HTML entities are properly decoded
- Blank lines are removed from descriptions

## Step 3: Download and Organize Images

```bash
node download-images.js
```

**What it does:**
- Reads product data from `extracted-products.json`
- Expects product images to exist in the `images/` folder (previously downloaded from WordPress)
- Organizes images into product-specific subdirectories using slugified product names
- Renames images to follow the pattern: `{product-slug}-{sequence-number}.{extension}`
- Updates `extracted-products.json` with local image paths
- Handles concurrent operations (10 at a time) for performance

**Output:**
- `images/{product-slug}/` — Organized image directories
- Updated `extracted-products.json` — With local image paths

**Image Organization Example:**
```
images/
├── granddaddy-purple/
│   ├── granddaddy-purple-1.jpg
│   ├── granddaddy-purple-2.jpg
│   └── granddaddy-purple-3.jpg
├── pineapple-express/
│   ├── pineapple-express-1.jpg
│   └── pineapple-express-2.jpg
└── ...
```

**Slugification Rules:**
- Removes parenthetical content: `Strain (RBX)` → `Strain`
- Strips common suffixes: `RBX2`, `RBX1`, `Feminized`, `Seed`, etc.
- Converts to lowercase and hyphens: `Grand Daddy Purple` → `granddaddy-purple`
- Removes special characters except hyphens

**Summary Output:**
- Number of images moved
- Number of images skipped (already exist)
- Number of failed operations with details

## Complete Migration Workflow

```bash
node fetch-products.js
node extract-products.js
node download-images.js
```

This will produce the final `extracted-products.json` with:
- All product information properly formatted
- Image paths pointing to local files

## Output Files

- **products.json** — Raw WooCommerce API response (temporary, safe to delete after extracting)
- **extracted-products.json** — Final product data ready for import into the app
- **images/** — Product images organized by product slug

## Troubleshooting

**"Cannot find module" error:**
- Ensure you're running the script from the `wordpress-migration/` directory
- Verify Node.js is installed: `node --version`

**"Unauthorized" or API errors:**
- Check that `WP_CONSUMER_KEY` and `WP_CONSUMER_SECRET` are correctly set in `.env.local`
- Verify the API credentials are valid in your WordPress admin panel

**Images not found:**
- Ensure product images have been downloaded to the `images/` folder before running `download-images.js`
- Check that image filenames match what's in the `products.json` (e.g., URLs need to be converted to filenames)

**Missing product attributes:**
- The extraction script looks for specific HTML table row patterns in product descriptions
- If attributes aren't being extracted, check the WordPress product table formatting
- You may need to add additional field name variations to the `getTableValue()` calls in `extract-products.js`

## Notes

- These scripts are idempotent — re-running them won't cause duplicates
- The `download-images.js` script skips images that already exist in the destination
- All scripts use the current directory structure and relative paths
