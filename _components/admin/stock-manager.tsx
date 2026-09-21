"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import classNames from "classnames";
import { updateStock } from "@/_actions/admin-stock-actions";
import { createStrainSlug } from "@/_lib/utils/slug-utils";
import ConfirmStockModal from "./confirm-stock-modal";

interface StockManagerProps {
  strains: { title: string; inStock: boolean }[];
}

const StockManager = ({ strains }: StockManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [noChanges, setNoChanges] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const buildStockState = (
    source: { title: string; inStock: boolean }[],
  ) =>
    Object.fromEntries(
      source.map((strain) => [createStrainSlug(strain.title), strain.inStock]),
    );

  const [savedState, setSavedState] = useState<Record<string, boolean>>(() =>
    buildStockState(strains),
  );

  const [stockState, setStockState] = useState<Record<string, boolean>>(() =>
    buildStockState(strains),
  );

  const [state, formAction, isPending] = useActionState(updateStock, {
    success: false,
    error: null as string | null,
  });

  useEffect(() => {
    if (state.success && !isPending) {
      setSavedState(stockState);
    }
  }, [state, isPending]);

  const matchesSearch = (title: string) =>
    title.toLowerCase().includes(searchTerm.trim().toLowerCase());

  const visibleCount = strains.filter((strain) =>
    matchesSearch(strain.title),
  ).length;

  const changedToInStock = strains
    .filter((strain) => {
      const slug = createStrainSlug(strain.title);
      return stockState[slug] && !savedState[slug];
    })
    .map((strain) => strain.title);

  const changedToOutOfStock = strains
    .filter((strain) => {
      const slug = createStrainSlug(strain.title);
      return !stockState[slug] && savedState[slug];
    })
    .map((strain) => strain.title);

  const changeCount = changedToInStock.length + changedToOutOfStock.length;

  const toggleStrain = (slug: string) => {
    setNoChanges(false);
    setStockState((previous) => ({ ...previous, [slug]: !previous[slug] }));
  };

  const handleSaveClick = () => {
    if (changeCount === 0) {
      setNoChanges(true);
      return;
    }

    setNoChanges(false);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    formRef.current?.requestSubmit();
  };

  const handleCancelClick = () => {
    setNoChanges(false);
    setShowDiscardConfirm(true);
  };

  const handleDiscardConfirm = () => {
    setShowDiscardConfirm(false);
    setStockState(savedState);
  };

  return (
    <div className="grid gap-5">
      <div className="sticky top-26 z-10 bg-black grid gap-5 pt-5">
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

        <div className="flex items-center justify-between gap-5 border-b border-green pb-3">
          <span className="text-white text-subheading">Strain name</span>
          <span className="text-white text-subheading">Stock status</span>
        </div>
      </div>

      <form ref={formRef} action={formAction} className="grid gap-5">
        <ul className="grid gap-2">
          {strains.map((strain) => {
            const slug = createStrainSlug(strain.title);
            const isInStock = stockState[slug];

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

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={classNames({
                      "text-green": isInStock,
                      "text-red": !isInStock,
                    })}
                  >
                    {isInStock ? "In stock" : "Out of stock"}
                  </span>
                  <input
                    id={slug}
                    name={slug}
                    type="checkbox"
                    checked={isInStock}
                    onChange={() => toggleStrain(slug)}
                    className="w-5 h-5 shrink-0 accent-green desktop:hover:cursor-pointer"
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {visibleCount === 0 && (
          <p className="text-white">Sorry, no strains match your search.</p>
        )}

        <div className="sticky bottom-0 z-10 bg-black grid gap-3 py-5 border-t border-white/20">
          <div className="grid gap-3 justify-items-start tablet:flex tablet:items-center tablet:gap-5">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isPending}
              className="bg-green px-5 py-2 rounded-md ease-in-out duration-300 desktop:hover:cursor-pointer desktop:hover:opacity-80"
            >
              <span className="text-black text-subheading">
                {isPending ? "Saving..." : "Save changes"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isPending || changeCount === 0}
              className={classNames(
                "relative px-5 py-2 rounded-md ease-in-out duration-300",
                "desktop:hover:cursor-pointer desktop:hover:opacity-80",
                { "opacity-50": changeCount === 0 },
              )}
            >
              <span className="text-white text-subheading">Cancel</span>
              <div className="absolute border border-white/40 border-solid inset-0 pointer-events-none rounded-md" />
            </button>

            <span className="text-white/60">
              {changeCount === 1 ? "1 change" : `${changeCount} changes`}
            </span>
          </div>

          {isPending && <p className="text-white">Saving your changes...</p>}
          {noChanges && !isPending && (
            <p className="text-white">No changes to save.</p>
          )}
          {state.error && !isPending && changeCount > 0 && (
            <p className="text-red">{state.error}</p>
          )}
          {state.success && !isPending && changeCount === 0 && (
            <p className="text-green">
              Saved! The site will update in a couple of minutes.
            </p>
          )}
        </div>
      </form>

      {showConfirm && (
        <ConfirmStockModal
          heading="Confirm your changes"
          confirmLabel="Confirm and save"
          changedToInStock={changedToInStock}
          changedToOutOfStock={changedToOutOfStock}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showDiscardConfirm && (
        <ConfirmStockModal
          heading="Discard your changes?"
          message={
            changeCount === 1
              ? "Your 1 unsaved change will be reset. This cannot be undone."
              : `Your ${changeCount} unsaved changes will be reset. This cannot be undone.`
          }
          confirmLabel="Yes, discard"
          variant="discard"
          onConfirm={handleDiscardConfirm}
          onCancel={() => setShowDiscardConfirm(false)}
        />
      )}
    </div>
  );
};

export default StockManager;
