"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import ButtonType from "@/_components/ui/buttons/button-type";
import { useCart } from "@/_contexts/cart-context";
import Link from "next/link";

interface StrainCartComponentProps {
  strainId: string;
  strainName: string;
  strainPrice: number;
  strainImage?: string;
  inStock: boolean;
  cssClasses?: string;
}

const StrainCartComponent = ({
  strainId,
  strainName,
  strainPrice,
  strainImage,
  inStock,
  cssClasses,
}: StrainCartComponentProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number | string>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<"add" | "view">("add");
  const { addToCart } = useCart();

  const increaseQuantity = () =>
    setQuantity((prev) => {
      const num = typeof prev === "string" ? 1 : prev;
      const newQuantity = num < 50 ? num + 1 : 50;
      if (buttonState === "view" && newQuantity > 1) {
        setButtonState("add");
      }
      return newQuantity;
    });
  const decreaseQuantity = () =>
    setQuantity((prev) => {
      const num = typeof prev === "string" ? 1 : prev;
      return num > 1 ? num - 1 : 1;
    });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("" as any);
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
      setQuantity(numValue);
      if (buttonState === "view" && numValue > 1) {
        setButtonState("add");
      }
    } else if (numValue > 50) {
      setQuantity(50);
      if (buttonState === "view" && 50 > 1) {
        setButtonState("add");
      }
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || (typeof quantity === "number" && quantity < 1)) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (buttonState === "view") {
      router.push("/cart");
      return;
    }

    const qty = typeof quantity === "string" ? 1 : quantity;
    addToCart(
      {
        id: strainId,
        name: strainName,
        price: strainPrice,
        image: strainImage,
      },
      qty,
    );

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setButtonState("view");
    }, 1500);
    setQuantity(1);
  };

  return (
    <div
      className={classNames(
        "relative grid gap-5 w-full desktop:gap-2.5",
        cssClasses,
      )}
    >
      <div className="flex items-center gap-5 justify-between w-full">
        <div className="grid items-center w-[46px] tablet:grid-cols-2 tablet:w-auto">
          <button
            onClick={increaseQuantity}
            disabled={
              !inStock || (typeof quantity === "number" && quantity >= 50)
            }
            title={
              !inStock ? "This product is currently out of stock" : undefined
            }
            className={classNames(
              "bg-green w-full h-6 rounded-t-md flex items-center justify-center tablet:w-[22px] tablet:rounded-t-none tablet:rounded-tr-md",
              {
                "cursor-not-allowed opacity-50":
                  !inStock || (typeof quantity === "number" && quantity >= 50),
                "tablet:hover:cursor-pointer tablet:hover:opacity-90 ease-in-out duration-300":
                  inStock &&
                  (typeof quantity !== "number" ||
                    (typeof quantity === "number" && quantity < 50)),
              },
            )}
          >
            <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
              <path d="M5 0L0 5H10L5 0Z" fill="#353535" />
            </svg>
          </button>

          <div className="border-2 border-white w-full h-[39px] flex items-center justify-center tablet:order-first tablet:row-span-2 tablet:h-[48px] tablet:rounded-l-md tablet:w-[46px]">
            {inStock ? (
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className="bg-transparent text-white text-[20px] text-center w-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ) : (
              <span className="text-white text-[20px]">0</span>
            )}
          </div>

          <button
            onClick={decreaseQuantity}
            disabled={
              !inStock || (typeof quantity === "number" && quantity === 1)
            }
            title={
              !inStock ? "This product is currently out of stock" : undefined
            }
            className={classNames(
              "bg-green w-full h-6 rounded-b-md flex items-center justify-center border-t border-white tablet:w-[22px] tablet:rounded-b-none tablet:rounded-br-md",
              {
                "opacity-50 cursor-not-allowed":
                  !inStock || (typeof quantity === "number" && quantity === 1),
                "tablet:hover:cursor-pointer tablet:hover:opacity-90 ease-in-out duration-300":
                  inStock &&
                  (typeof quantity !== "number" ||
                    (typeof quantity === "number" && quantity !== 1)),
              },
            )}
          >
            <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
              <path d="M5 5L10 0H0L5 5Z" fill="#353535" />
            </svg>
          </button>
        </div>
        <ButtonType
          type="button"
          cssClasses={classNames({
            "cursor-not-allowed opacity-50": !inStock,
          })}
          disabled={!inStock || isLoading}
          title={
            !inStock ? "This product is currently out of stock" : undefined
          }
          colorBlack={buttonState === "view"}
          greenStroke={buttonState === "view"}
          onClick={handleAddToCart}
        >
          {isLoading
            ? "Adding..."
            : buttonState === "view"
              ? "View Cart"
              : "Add To Cart"}
        </ButtonType>
      </div>
      {typeof quantity === "number" && quantity >= 50 && (
        <p className="text-green italic">
          Please contact us directly for any orders with over 50 clones from a
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
};

export default StrainCartComponent;
