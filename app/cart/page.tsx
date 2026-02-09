"use client";

import { useCart } from "@/_contexts/cart-context";
import CartItemComponent from "@/_components/cart-page/cart-item-component";
import CartSummary from "@/_components/cart-page/cart-summary";
import Link from "next/link";
import ButtonType from "@/_components/ui/buttons/button-type";
import ButtonLink from "@/_components/ui/buttons/button-link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const {
    items,
    getTotalItems,
    clearCart,
    showEmailSubmitted,
    setShowEmailSubmitted,
  } = useCart();
  const totalItems = getTotalItems();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (showEmailSubmitted) {
      const element = document.getElementById("order-completed");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showEmailSubmitted]);

  if (showEmailSubmitted) {
    return (
      <div
        className="w-full px-5 min-h-[600px] flex flex-col justify-center items-center space-y-5"
        id="order-completed"
      >
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="bg-green rounded-full p-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#353535"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-subheading text-white">Order Submitted!</h3>
          <p className="text-paragraph text-white/80">
            Thank you for your order. Please check your email for your order
            confirmation and details.
          </p>
        </div>
        <ButtonLink
          href="/strains"
          type="button"
          onClick={() => setShowEmailSubmitted(false)}
        >
          Browse Strains
        </ButtonLink>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 desktop:px-10 py-15">
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-5">
          <h1 className="text-heading text-white">Your Cart is Empty</h1>
          <p className="text-paragraph text-white/80">
            Browse our strains and add some items to your cart
          </p>
          <Link href="/strains">
            <ButtonType type="button">Browse Strains</ButtonType>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 desktop:px-10 py-15">
      <div className="space-y-10">
        <div className="border-b-4 border-green pb-5 flex flex-col gap-5 items-start min-[500px]:flex-row min-[500px]:justify-between min-[500px]:items-end">
          <h1 className="text-heading text-white">Your Cart</h1>
          <ButtonLink href="/strains" type="button">
            Continue Shopping
          </ButtonLink>
        </div>
        {totalItems < 4 && (
          <div className="p-4 bg-red rounded-md">
            <p className="text-white text-subheading italic">
              *You must have at least 4 clones in your cart to submit an order
            </p>
          </div>
        )}
        <div className="desktop:grid desktop:grid-cols-[1fr_400px] desktop:gap-10 desktop:items-start">
          <div className="space-y-5 mb-10 desktop:mb-0">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
            {showConfirmClear ? (
              <div className="grid gap-4">
                <p>Are you sure you want to clear your cart?</p>
                <div className="flex gap-4">
                  <ButtonType
                    type="button"
                    onClick={() => {
                      clearCart();
                      setShowConfirmClear(false);
                    }}
                  >
                    Confirm
                  </ButtonType>
                  <ButtonType
                    type="button"
                    onClick={() => setShowConfirmClear(false)}
                  >
                    Cancel
                  </ButtonType>
                </div>
              </div>
            ) : (
              <ButtonType
                type="button"
                onClick={() => setShowConfirmClear(true)}
              >
                Clear Cart
              </ButtonType>
            )}
          </div>

          <CartSummary />
        </div>
      </div>
    </div>
  );
}
