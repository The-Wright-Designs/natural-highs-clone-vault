"use client";

import Link from "next/link";
import { useState } from "react";

import classNames from "classnames";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { fetchPhoneNumber } from "@/_actions/contact-actions";
import { showContactProps } from "@/_types/general-types";

const ShowPhoneNumber = ({ buttonClasses, linkClasses }: showContactProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showPhone, setShowPhone] = useState("Show phone number");
  const [showSpinnerPhone, setShowSpinnerPhone] = useState(false);

  const handleShowPhoneNumbers = async () => {
    setShowSpinnerPhone(true);

    try {
      let recaptchaToken: string | undefined;

      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("fetch_phone");
      }

      const phoneNumber =
        (await fetchPhoneNumber(recaptchaToken)) || "Phone number not found";
      setShowPhone(phoneNumber);
    } catch (error) {
      console.error("Error fetching phone:", error);
      setShowPhone("Phone not available");
    }

    setShowSpinnerPhone(false);
  };

  if (showPhone === "Show phone number") {
    return (
      <button
        onClick={() => handleShowPhoneNumbers()}
        className={classNames(
          "px-2 text-left -mx-2 text-paragraph py-3 -my-3 underline underline-offset-4 hover:tablet:text-green hover:cursor-pointer desktop:p-0 desktop:m-0 ease-in-out duration-300",
          buttonClasses,
        )}
        aria-label="Show phone number"
      >
        {showSpinnerPhone ? <div className="spinner-green"></div> : showPhone}
      </button>
    );
  } else {
    return (
      <Link
        href={`tel:${showPhone}`}
        className={classNames(
          "py-3 text-left px-2 -my-3 -mx-2 text-paragraph underline underline-offset-4 tablet:hover:text-green desktop:p-0 desktop:m-0",
          linkClasses,
        )}
      >
        {showPhone}
      </Link>
    );
  }
};

export default ShowPhoneNumber;
