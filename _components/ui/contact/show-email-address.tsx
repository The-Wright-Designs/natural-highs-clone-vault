"use client";

import Link from "next/link";
import { useState } from "react";

import classNames from "classnames";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { fetchEmailAddress } from "@/_actions/contact-actions";
import { showContactProps } from "@/_types/general-types";

const ShowEmailAddress = ({ buttonClasses, linkClasses }: showContactProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showEmail, setShowEmail] = useState("Show email address");
  const [showSpinnerEmail, setShowSpinnerEmail] = useState(false);

  const handleShowEmailAddress = async () => {
    setShowSpinnerEmail(true);

    try {
      let recaptchaToken: string | undefined;

      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("fetch_email");
      }

      const emailAddress =
        (await fetchEmailAddress(recaptchaToken)) || "Email not found";
      setShowEmail(emailAddress);
    } catch (error) {
      console.error("Error fetching email:", error);
      setShowEmail("Email not available");
    }

    setShowSpinnerEmail(false);
  };

  if (showEmail === "Show email address") {
    return (
      <button
        onClick={() => handleShowEmailAddress()}
        className={classNames(
          "px-2 text-left -mx-2 text-paragraph underline underline-offset-4 py-3 -my-3 hover:tablet:text-green hover:cursor-pointer desktop:p-0 desktop:m-0 ease-in-out duration-300",
          buttonClasses,
        )}
        aria-label="Show email address"
      >
        {showSpinnerEmail ? <div className="spinner-green"></div> : showEmail}
      </button>
    );
  } else {
    return (
      <Link
        href={`mailto:${showEmail}`}
        className={classNames(
          "py-3 text-left px-2 -my-3 -mx-2 text-paragraph underline underline-offset-4 tablet:hover:text-green desktop:p-0 desktop:m-0",
          linkClasses,
        )}
      >
        {showEmail}
      </Link>
    );
  }
};

export default ShowEmailAddress;
