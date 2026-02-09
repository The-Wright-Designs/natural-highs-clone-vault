"use client";

import { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { CartItem } from "@/_types/cart-types";
import { useCart } from "@/_contexts/cart-context";
import Link from "next/link";

interface CartItemComponentProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState<number | string>(item.quantity);
  const [showConfirm, setShowConfirm] = useState(false);

  const increaseQuantity = () => {
    const newQty = Math.min(item.quantity + 1, 50);
    setQuantity(newQty);
    updateQuantity(item.id, newQty);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      setQuantity(newQty);
      updateQuantity(item.id, newQty);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
      setQuantity(numValue);
      updateQuantity(item.id, numValue);
    } else if (numValue > 50) {
      setQuantity(50);
      updateQuantity(item.id, 50);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || (typeof quantity === "number" && quantity < 1)) {
      setQuantity(item.quantity);
    }
  };

  return (
    <div className="bg-black/50 border border-green/25 rounded-md p-5 grid gap-5">
      <div className="flex flex-col gap-5 min-[400px]:flex-row">
        {item.image && (
          <div className="relative w-full aspect-square overflow-hidden rounded-md min-[400px]:aspect-auto min-[400px]:w-32 min-[400px]:h-40 desktop:w-24 desktop:h-32">
            <Image
              src={item.image}
              alt={item.name}
              width={160}
              height={160}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start gap-x-5">
            <div>
              <h3 className="text-subheading text-white">{item.name}</h3>
              <p className="text-paragraph text-white/80">R{item.price} each</p>
            </div>
            {showConfirm ? (
              <div className="flex flex-col gap-2 min-[600px]:flex-row">
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    setShowConfirm(false);
                  }}
                  className="ease-in-out duration-300 p-2 -m-2 desktop:cursor-pointer desktop:hover:opacity-80 desktop:p-0 desktop:m-0 text-green"
                  aria-label="Confirm remove item"
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="ease-in-out duration-300 p-2 -m-2 desktop:cursor-pointer desktop:hover:opacity-80 desktop:p-0 desktop:m-0 text-white"
                  aria-label="Cancel remove item"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="ease-in-out duration-300 p-2 -m-2 desktop:cursor-pointer desktop:hover:opacity-80 desktop:p-0 desktop:m-0"
                aria-label="Remove item"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 2L14 14M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid items-center w-[46px] tablet:grid-cols-2 tablet:w-auto">
                <button
                  onClick={increaseQuantity}
                  disabled={item.quantity >= 50}
                  className={classNames(
                    "bg-green w-full h-6 rounded-t-md flex items-center justify-center tablet:w-[22px] tablet:rounded-t-none tablet:rounded-tr-md",
                    {
                      "cursor-not-allowed opacity-50": item.quantity >= 50,
                      "tablet:hover:cursor-pointer tablet:hover:opacity-90 ease-in-out duration-300":
                        item.quantity < 50,
                    },
                  )}
                >
                  <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
                    <path d="M5 0L0 5H10L5 0Z" fill="#353535" />
                  </svg>
                </button>

                <div className="border-2 border-white w-full h-[39px] flex items-center justify-center tablet:order-first tablet:row-span-2 tablet:h-[48px] tablet:rounded-l-md tablet:w-[46px]">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    className="bg-transparent text-white text-[20px] text-center w-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <button
                  onClick={decreaseQuantity}
                  disabled={item.quantity === 1}
                  className={classNames(
                    "bg-green w-full h-6 rounded-b-md flex items-center justify-center border-t border-white tablet:w-[22px] tablet:rounded-b-none tablet:rounded-br-md",
                    {
                      "opacity-50 cursor-not-allowed": item.quantity === 1,
                      "tablet:hover:cursor-pointer tablet:hover:opacity-90 ease-in-out duration-300":
                        item.quantity > 1,
                    },
                  )}
                >
                  <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
                    <path d="M5 5L10 0H0L5 5Z" fill="#353535" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-subheading text-green">
                R{(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-[12px] text-white/60">Subtotal</p>
            </div>
          </div>
        </div>
      </div>

      {typeof quantity === "number" && quantity >= 50 && (
        <p className="text-green italic">
          *Please contact us directly for any orders with over 50 clones from a
          single plant -{" "}
          <Link
            href="/#contact"
            className="underline underline-offset-4 desktop:hover:opacity-80"
            target="_blank"
          >
            Contact Us
          </Link>
        </p>
      )}
    </div>
  );
}
