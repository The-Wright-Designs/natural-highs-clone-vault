"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/_contexts/cart-context";
import ButtonType from "@/_components/ui/buttons/button-type";
import ErrorPopup from "@/_components/ui/error-popup";
import classNames from "classnames";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  sendOrderEmailStaff,
  sendOrderEmailCustomer,
} from "@/_actions/send-order-emails";
import { generateOrderNumber } from "@/_lib/utils/generate-order-number";
import Link from "next/link";

export default function CartSummary() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    getTotalPrice,
    getTotalItems,
    items,
    clearCart,
    setShowEmailSubmitted,
  } = useCart();

  const calculateDeliveryFee = (totalClones: number): number => {
    if (totalClones >= 4 && totalClones <= 12) return 180;
    if (totalClones >= 13 && totalClones <= 30) return 280;
    if (totalClones >= 31) return 520;
    return 280; // Default for edge cases (quantities < 4)
  };

  const getDeliveryFeeNote = (totalClones: number): string => {
    if (totalClones >= 4 && totalClones <= 12) {
      return "Delivery fee for 4-12 clones";
    }
    if (totalClones >= 13 && totalClones <= 30) {
      return "Delivery fee for 13-30 clones";
    }
    if (totalClones >= 31) {
      return "Delivery fee for 31+ clones";
    }
    return "Minimum 4 clones required for delivery";
  };
  const [submissionStartTime, setSubmissionStartTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [termsAcknowledged, setTermsAcknowledged] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState({
    "given-name": "",
    "family-name": "",
    email: "",
    tel: "",
    "address-line1": "",
    "address-line2": "",
    "address-level2": "",
    "address-level1": "",
    "postal-code": "",
    country: "South Africa",
    notes: "",
  });

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryFee = calculateDeliveryFee(totalItems);
  const totalWithDelivery = totalPrice + deliveryFee;

  const handleFormSubmit = async (formDataObj: FormData) => {
    try {
      setError(null);

      if (!executeRecaptcha) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!executeRecaptcha) {
          setError(
            "Security verification unavailable. Please refresh the page and try again.",
          );
          return;
        }
      }

      const recaptchaToken = await executeRecaptcha("order_form");
      formDataObj.append("recaptchaToken", recaptchaToken);

      const orderNumber = generateOrderNumber();

      formDataObj.append("cartData", JSON.stringify(items));
      formDataObj.append("totalPrice", totalPrice.toString());
      formDataObj.append("deliveryFee", deliveryFee.toString());
      formDataObj.append("totalWithDelivery", totalWithDelivery.toString());
      formDataObj.append("orderNumber", orderNumber);

      const staffResult = await sendOrderEmailStaff(formDataObj);

      if (!staffResult.success) {
        setError(
          staffResult.error ||
            "Failed to process your order. Please try again.",
        );
        return;
      }

      const customerResult = await sendOrderEmailCustomer(formDataObj, true);

      if (!customerResult.success) {
        setError(
          `Order submitted successfully, but there was an issue sending your confirmation email: ${customerResult.error}. Please save your order number: ${orderNumber}`,
        );
        setShowEmailSubmitted(true);
        clearCart();
        return;
      }

      if (staffResult.success && customerResult.success) {
        setShowEmailSubmitted(true);
        clearCart();
        setFormData({
          "given-name": "",
          "family-name": "",
          email: "",
          tel: "",
          "address-line1": "",
          "address-line2": "",
          "address-level2": "",
          "address-level1": "",
          "postal-code": "",
          country: "South Africa",
          notes: "",
        });
      } else {
        const errors = [];
        if (!staffResult.success) {
          const staffError =
            staffResult.error ||
            "We encountered an issue processing your order";
          errors.push(
            `Order processing failed: ${staffError}. Please check your details and try again.`,
          );
        }
        if (!customerResult.success) {
          const customerError =
            customerResult.error || "We couldn't send your confirmation email";
          errors.push(`Email confirmation failed: ${customerError}.`);
        }
        setError(
          errors.join(" ") +
            " If the problem persists, please reach out to our support team.",
        );
      }
    } catch (err) {
      setError(
        "We're experiencing technical difficulties. Please try submitting your order again in a few moments. If the issue continues, contact our support team.",
      );
      console.error("Order submission error:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAcknowledged(e.target.checked);
  };

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  useEffect(() => {
    const startSubmissionTimer = () => {
      setSubmissionStartTime(new Date().getTime());
    };
    startSubmissionTimer();
  }, []);

  return (
    <div className="bg-black/50 border border-green rounded-md p-5 desktop:p-8 sticky top-28">
      <form action={handleFormSubmit} className="space-y-5">
        <input type="hidden" name="_honey" className="hidden" />
        <h2 className="text-subheading text-white border-b border-green/25 pb-3">
          Order Summary
        </h2>

        <div className="space-y-3 pb-5 border-b border-green/25">
          <div
            className={classNames("flex justify-between text-paragraph", {
              "p-2 -mx-2 bg-red rounded-md": totalItems < 4,
            })}
          >
            <span>Total clones</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-paragraph">
            <span>Subtotal</span>
            <span>R{totalPrice.toFixed(2)}</span>
          </div>
          <div>
            <div className="flex justify-between text-paragraph">
              <span>Standard delivery</span>
              <span>R{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="text-[14px] text-white/50">
              {getDeliveryFeeNote(totalItems)}
            </div>
          </div>
          <div className="flex justify-between text-subheading">
            <span className="font-bold text-green">Total</span>
            <span className="font-bold text-green">
              R{totalWithDelivery.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-subheading text-white">Your Details</h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="given-name"
                className="block text-paragraph text-white/80 mb-2"
              >
                First name: *
              </label>
              <input
                type="text"
                id="given-name"
                name="given-name"
                autoComplete="given-name"
                required
                value={formData["given-name"]}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="family-name"
                className="block text-paragraph text-white/80 mb-2"
              >
                Last name: *
              </label>
              <input
                type="text"
                id="family-name"
                name="family-name"
                autoComplete="family-name"
                required
                value={formData["family-name"]}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-paragraph text-white/80 mb-2"
              >
                Email: *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="tel"
                className="block text-paragraph text-white/80 mb-2"
              >
                Phone: *
              </label>
              <input
                type="tel"
                id="tel"
                name="tel"
                autoComplete="tel"
                required
                value={formData.tel}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 mt-8">
          <button
            type="button"
            onClick={toggleDetails}
            className={classNames(
              "w-full flex items-center justify-between p-2 rounded-md text-left desktop:hover:cursor-pointer desktop:hover:opacity-80 transition-colors",
              {
                "bg-green": !isDetailsOpen,
              },
            )}
          >
            <h3
              className={classNames("text-subheading", {
                "text-black": !isDetailsOpen,
                "text-white": isDetailsOpen,
              })}
            >
              Delivery Details *
            </h3>
            <svg
              className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                isDetailsOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke={classNames({
                "#353535": !isDetailsOpen,
                currentColor: isDetailsOpen,
              })}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isDetailsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address-line1"
                  className="block text-paragraph text-white/80 mb-1"
                >
                  Street address line 1: *
                </label>
                <input
                  type="text"
                  id="address-line1"
                  name="address-line1"
                  autoComplete="address-line1"
                  className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
                  required
                  value={formData["address-line1"]}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="address-line2"
                  className="block text-paragraph text-white/80 mb-1"
                >
                  Apartment, suite, unit, etc. (optional):
                </label>
                <input
                  type="text"
                  id="address-line2"
                  name="address-line2"
                  autoComplete="address-line2"
                  className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
                  value={formData["address-line2"]}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="address-level2"
                  className="block text-paragraph text-white/80 mb-1"
                >
                  Town/City: *
                </label>
                <input
                  type="text"
                  id="address-level2"
                  name="address-level2"
                  autoComplete="address-level2"
                  className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
                  required
                  value={formData["address-level2"]}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="postal-code"
                  className="block text-paragraph text-white/80 mb-1"
                >
                  Postcode: *
                </label>
                <input
                  type="text"
                  id="postal-code"
                  name="postal-code"
                  autoComplete="postal-code"
                  className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors"
                  required
                  value={formData["postal-code"]}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="address-level1"
                  className="block text-paragraph text-white/80 mb-1"
                >
                  Province: *
                </label>
                <div className="relative">
                  <select
                    id="address-level1"
                    name="address-level1"
                    autoComplete="address-level1"
                    className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors appearance-none"
                    required
                    value={formData["address-level1"]}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Province</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="North West">North West</option>
                    <option value="Western Cape">Western Cape</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-paragraph text-white/80 mb-1"
                >
                  Country: *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  autoComplete="country"
                  className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white/60 cursor-not-allowed"
                  required
                  value={formData.country}
                  disabled
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="notes"
              className="block text-paragraph text-white/80 mb-2"
            >
              Order Notes (Optional):
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full bg-black/50 border border-white/25 rounded-md px-4 py-3 text-white focus:outline-none focus:border-green transition-colors resize-none"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-5 p-5 border border-white/25 rounded-md">
          <div className="grid gap-2">
            <h4>Payment</h4>
            <p className="text-[14px]">
              <span className="font-bold text-[14px]">
                Payment is via EFT only.
              </span>{" "}
              Please use the order number that will be emailed to you as the
              payment reference.
            </p>
          </div>

          <div className="grid gap-2">
            <h4>Delivery</h4>
            <p className="text-[14px]">
              <span className="font-bold text-[14px]">
                Delivery will take a minimum of 14 days
              </span>{" "}
              once your payment has cleared in our account.
            </p>
          </div>

          <div className="flex items-start gap-5 min-[585px]:items-center desktop:items-center">
            <input
              type="checkbox"
              id="terms-acknowledged"
              checked={termsAcknowledged}
              onChange={handleTermsChange}
              className="min-w-8 w-8 h-8 bg-black/50 border border-white/25 rounded focus:outline-none focus:border-green transition-colors cursor-pointer desktop:min-w-5 desktop:w-5 desktop:h-5"
            />
            <label
              htmlFor="terms-acknowledged"
              className="text-[14px] text-white cursor-pointer select-none"
            >
              I acknowledge the payment and delivery terms listed above
            </label>
          </div>
        </div>

        <ButtonType
          type="submit"
          cssClasses="w-full"
          disabled={totalItems < 4 || !termsAcknowledged}
          title={
            totalItems < 4
              ? "You must have a minimum of 4 clones in your cart to submit an order"
              : !termsAcknowledged
                ? "You must acknowledge the payment and delivery terms to submit an order"
                : "Submit Order"
          }
        >
          Submit Order
        </ButtonType>
      </form>
      <p className="text-[14px] text-white/60 mt-4">
        By placing your order, you agree that we'll use your details only to
        process your purchase — and we'll never share them without your consent.
      </p>
      <p className="text-[14px] mt-4 text-white/75">
        This site is protected by reCAPTCHA and the Google{" "}
        <Link
          href="https://policies.google.com/privacy"
          target="_blank"
          className="underline underline-offset-4 desktop:hover:opacity-85 ease-in-out duration-300"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="https://policies.google.com/terms"
          target="_blank"
          className="underline underline-offset-4 desktop:hover:opacity-85 ease-in-out duration-300"
        >
          Terms of Service
        </Link>{" "}
        apply.
      </p>

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  );
}
