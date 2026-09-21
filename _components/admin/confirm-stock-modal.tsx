"use client";

import { useEffect } from "react";
import classNames from "classnames";

interface ConfirmStockModalProps {
  heading: string;
  message?: string;
  confirmLabel: string;
  variant?: "save" | "discard";
  changedToInStock?: string[];
  changedToOutOfStock?: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmStockModal = ({
  heading,
  message,
  confirmLabel,
  variant = "save",
  changedToInStock = [],
  changedToOutOfStock = [],
  onConfirm,
  onCancel,
}: ConfirmStockModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const renderGroup = (
    heading: string,
    titles: string[],
    headingCssClasses: string,
  ) => {
    if (titles.length === 0) return null;

    return (
      <div className="grid gap-2">
        <h4 className={headingCssClasses}>
          {heading} ({titles.length})
        </h4>
        <ul className="grid gap-1">
          {titles.map((title) => (
            <li key={title}>
              <span className="text-white">{title}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={handleOverlayClick}
    >
      <div
        className={classNames(
          "bg-black border border-solid rounded-md p-6 max-w-md w-full max-h-[80vh] overflow-y-auto grid gap-5",
          {
            "border-green": variant === "save",
            "border-red": variant === "discard",
          },
        )}
      >
        <h3 className="text-white">{heading}</h3>

        {message && <p className="text-white">{message}</p>}

        {renderGroup("Changed to in stock", changedToInStock, "text-green")}
        {renderGroup("Changed to out of stock", changedToOutOfStock, "text-red")}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className={classNames(
              "px-5 py-2 rounded-md ease-in-out duration-300",
              "desktop:hover:cursor-pointer desktop:hover:opacity-80",
              {
                "bg-green": variant === "save",
                "bg-red": variant === "discard",
              },
            )}
          >
            <span
              className={classNames("text-subheading", {
                "text-black": variant === "save",
                "text-white": variant === "discard",
              })}
            >
              {confirmLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={classNames(
              "relative px-5 py-2 rounded-md ease-in-out duration-300",
              "desktop:hover:cursor-pointer desktop:hover:opacity-80",
            )}
          >
            <span className="text-white text-subheading">Go back</span>
            <div className="absolute border border-white/40 border-solid inset-0 pointer-events-none rounded-md" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStockModal;
