"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import navData from "@/_data/nav-data.json";
import { CartButton } from "@/_components/ui/buttons/cart-button";
import { useCart } from "@/_contexts/cart-context";

export function DesktopHeader() {
  const router = useRouter();
  const { setShowEmailSubmitted } = useCart();

  return (
    <div className="hidden pt-7 pb-1 px-10 items-center justify-between desktop:flex">
      <Link
        href="/"
        className="text-white text-[32px] font-light uppercase duration-300 ease-in-out hover:opacity-90"
      >
        <span className="text-white text-[32px] font-bold uppercase">
          Natural Highs
        </span>{" "}
        Clone Vault
      </Link>
      <nav className="translate-y-[7px]">
        <ul className="flex gap-5 items-center">
          {navData.map(({ title, url }, id) => {
            return (
              <li key={id}>
                <Link
                  href={url}
                  onClick={() => setShowEmailSubmitted(false)}
                  className="text-white text-paragraph ease-in-out duration-300 hover:text-green"
                >
                  {title}
                </Link>
              </li>
            );
          })}
          <li>
            <CartButton onClick={() => router.push("/cart")} />
          </li>
        </ul>
      </nav>
    </div>
  );
}
