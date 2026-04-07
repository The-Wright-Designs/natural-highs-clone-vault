"use server";

import strainsData from "@/_data/strains-data.json";
import { createStrainSlug } from "@/_lib/utils/slug-utils";

export async function validateCartStock(cartItemIds: string[]) {
  const outOfStockSlugs = new Set(
    strainsData
      .filter((s) => !s.inStock)
      .map((s) => createStrainSlug(s.title)),
  );

  const outOfStockItems = cartItemIds
    .filter((id) => outOfStockSlugs.has(id))
    .map((id) => {
      const strain = strainsData.find((s) => createStrainSlug(s.title) === id);
      return strain?.title ?? id;
    });

  return {
    valid: outOfStockItems.length === 0,
    outOfStockItems,
  };
}
