"use client";

import { useState, useActionState } from "react";
import classNames from "classnames";
import { updateStock } from "@/_actions/admin-stock-actions";
import { createStrainSlug } from "@/_lib/utils/slug-utils";

interface StockManagerProps {
  strains: { title: string; inStock: boolean }[];
}

const StockManager = ({ strains }: StockManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [state, formAction, isPending] = useActionState(updateStock, {
    success: false,
    error: null as string | null,
  });

  const matchesSearch = (title: string) =>
    title.toLowerCase().includes(searchTerm.trim().toLowerCase());

  const visibleCount = strains.filter((strain) =>
    matchesSearch(strain.title),
  ).length;

  return (
    <div className="grid gap-10">
      <div className="relative rounded-md w-full tablet:max-w-[400px]">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Find a strain..."
          className="bg-transparent text-white placeholder:text-white/50 w-full px-3 py-2.5 focus:outline-none"
        />
        <div className="absolute border border-green border-solid inset-0 pointer-events-none rounded-md" />
      </div>

      <form action={formAction} className="grid gap-10">
        <ul className="grid gap-2">
          {strains.map((strain) => {
            const slug = createStrainSlug(strain.title);
            return (
              <li
                key={slug}
                className={classNames(
                  "flex items-center justify-between gap-5 border-b border-white/20 py-3",
                  { hidden: !matchesSearch(strain.title) },
                )}
              >
                <label
                  htmlFor={slug}
                  className="text-white desktop:hover:cursor-pointer"
                >
                  {strain.title}
                </label>
                <input
                  id={slug}
                  name={slug}
                  type="checkbox"
                  defaultChecked={strain.inStock}
                  className="w-5 h-5 shrink-0 accent-green desktop:hover:cursor-pointer"
                />
              </li>
            );
          })}
        </ul>

        {visibleCount === 0 && (
          <p className="text-white">Sorry, no strains match your search.</p>
        )}

        {state.error && <p className="text-red">{state.error}</p>}
        {state.success && !isPending && (
          <p className="text-green">
            Saved! The site will update in a couple of minutes.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-green px-5 py-2 rounded-md justify-self-start ease-in-out duration-300 desktop:hover:cursor-pointer desktop:hover:opacity-80"
        >
          <span className="text-black text-subheading">
            {isPending ? "Saving..." : "Save changes"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default StockManager;
