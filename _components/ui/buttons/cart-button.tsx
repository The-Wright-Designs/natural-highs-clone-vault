"use client";

import classNames from "classnames";
import { useCart } from "@/_contexts/cart-context";
import { useState, useEffect, useRef } from "react";

interface CartProps {
  onClick?: () => void;
  cssClasses?: string;
  large?: boolean;
}

export function CartButton({ onClick, cssClasses, large }: CartProps) {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();
  const prevItemCount = useRef(itemCount);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 500);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  return (
    <button
      onClick={onClick}
      className={classNames(
        "relative flex items-center justify-center p-2 -m-2 cursor-pointer transition-transform ease-in-out desktop:p-0 desktop:m-0",
        {
          hidden: itemCount === 0,
          "delay-300 duration-200 scale-[140%] desktop:scale-150": justAdded,
          "duration-300 desktop:hover:scale-[105%]": !justAdded,
        },
        cssClasses,
      )}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg
        width={large ? "24" : "16"}
        height={large ? "24" : "16"}
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.51392 15.5C4.10142 15.5 3.74829 15.3531 3.45454 15.0594C3.16079 14.7656 3.01392 14.4125 3.01392 14C3.01392 13.5875 3.16079 13.2344 3.45454 12.9406C3.74829 12.6469 4.10142 12.5 4.51392 12.5C4.92642 12.5 5.27954 12.6469 5.57329 12.9406C5.86704 13.2344 6.01392 13.5875 6.01392 14C6.01392 14.4125 5.86704 14.7656 5.57329 15.0594C5.27954 15.3531 4.92642 15.5 4.51392 15.5ZM12.0139 15.5C11.6014 15.5 11.2483 15.3531 10.9545 15.0594C10.6608 14.7656 10.5139 14.4125 10.5139 14C10.5139 13.5875 10.6608 13.2344 10.9545 12.9406C11.2483 12.6469 11.6014 12.5 12.0139 12.5C12.4264 12.5 12.7795 12.6469 13.0733 12.9406C13.367 13.2344 13.5139 13.5875 13.5139 14C13.5139 14.4125 13.367 14.7656 13.0733 15.0594C12.7795 15.3531 12.4264 15.5 12.0139 15.5ZM3.87642 3.5L5.67642 7.25H10.9264L12.9889 3.5H3.87642ZM3.16392 2H14.2264C14.5139 2 14.7327 2.12813 14.8827 2.38438C15.0327 2.64062 15.0389 2.9 14.9014 3.1625L12.2389 7.9625C12.1014 8.2125 11.917 8.40625 11.6858 8.54375C11.4545 8.68125 11.2014 8.75 10.9264 8.75H5.33892L4.51392 10.25H13.5139V11.75H4.51392C3.95142 11.75 3.52642 11.5031 3.23892 11.0094C2.95142 10.5156 2.93892 10.025 3.20142 9.5375L4.21392 7.7L1.51392 2H0.013916V0.5H2.45142L3.16392 2Z"
          fill="#66e00b"
        />
      </svg>

      <span
        className={classNames(
          "absolute bg-white/90 text-black font-semibold rounded-full flex items-center justify-center px-1 min-w-5 h-5",
          {
            "-top-1 -right-1": large,
            "-top-3.5 -right-3.5": !large,
            "text-[11px] leading-[15px]": itemCount <= 99,
          },
        )}
      >
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </button>
  );
}
