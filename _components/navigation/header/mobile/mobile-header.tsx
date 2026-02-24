"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import classNames from "classnames";

import navData from "@/_data/nav-data.json";
import { CartButton } from "@/_components/ui/buttons/cart-button";
import { useCart } from "@/_contexts/cart-context";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { setShowEmailSubmitted, getTotalItems } = useCart();

  const totalItems = getTotalItems();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="relative px-7 pb-3 pt-6 desktop:hidden">
      <div className="flex w-full gap-10 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/natural-highs-clone-vault-logo.png"
            alt="Natural Highs Clone Vault logo"
            width={70}
            height={70}
            sizes="70px"
            className="hidden min-[410px]:block"
          />
          <h1 className="text-white text-[24px] leading-tight font-bold uppercase">
            Natural Highs{" "}
            <span className="text-white text-[24px] font-light uppercase">
              Clone Vault
            </span>
          </h1>{" "}
        </Link>
        <div className="flex shrink-0 items-center gap-10">
          <CartButton onClick={() => router.push("/cart")} />
          <button
            onClick={() => setIsOpen(true)}
            className="ease-in-out duration-300 -m-3 p-3"
            aria-label="Open menu"
          >
            <Image
              src="/icons/menu.svg"
              alt="Open menu"
              width={22}
              height={14}
              sizes="22px"
            />
          </button>
        </div>
      </div>

      {/* Slide-out Menu */}
      <div
        className={classNames(
          "fixed inset-0 z-50 transform bg-black transition-transform duration-300 ease-in-out",
          {
            "translate-x-full": !isOpen,
          },
        )}
      >
        <div
          className={classNames("flex w-full py-10 items-center px-7", {
            "justify-between": totalItems > 0,
            "justify-end": totalItems === 0,
          })}
        >
          <CartButton
            large
            cssClasses="-translate-y-0.5"
            onClick={() => {
              router.push("/cart");
              setIsOpen(false);
            }}
          />
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-2 -m-2"
          >
            <Image
              src="/icons/close.svg"
              alt="Close menu"
              width={16}
              height={16}
              sizes="16px"
            />
          </button>
        </div>
        <nav className="px-7">
          <ul className="grid gap-5">
            {navData.map(({ title, url }, id) => {
              return (
                <li key={id}>
                  <Link
                    href={url}
                    onClick={() => {
                      setIsOpen(false);
                      setShowEmailSubmitted(false);
                    }}
                    className="text-[18px] text-white font-normal p-3 -m-3"
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
