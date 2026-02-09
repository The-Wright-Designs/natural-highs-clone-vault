"use client";

import { useEffect, useState } from "react";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { sendEmail } from "@/_actions/send-email-actions";
import ButtonType from "@/_components/ui/buttons/button-type";
import Link from "next/link";

const ContactFormComponent = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showEmailSubmitted, setShowEmailSubmitted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (showEmailSubmitted) {
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showEmailSubmitted]);

  return (
    <div className="border-green border-4 px-5 py-10 -mx-5 tablet:mx-0 tablet:py-5 tablet:rounded-md">
      {!showEmailSubmitted && (
        <p className="mb-8 italic font-light">
          Fill out the form below and our team will get back to you ASAP...
        </p>
      )}
      {showEmailSubmitted ? (
        <div className="size-full flex justify-center items-center desktop:h-[450px]">
          <p className="text-[20px] font-bold pb-5">
            Your email has been sent, we will be in touch soon.
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-8"
          action={async (formData) => {
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

              const recaptchaToken = await executeRecaptcha("contact_form");
              formData.append("recaptchaToken", recaptchaToken);

              const result = await sendEmail(formData);

              if (result.success) {
                setShowEmailSubmitted(true);
                setFormData({
                  email: "",
                  name: "",
                  phone: "",
                  message: "",
                });
              } else {
                setError(
                  result.error || "Failed to send message. Please try again.",
                );
              }
            } catch (err) {
              setError("An unexpected error occurred. Please try again.");
              console.error("Contact form error:", err);
            }
          }}
        >
          <input
            type="text"
            name="_honey"
            className="visually-hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          <label
            htmlFor="emailAddress"
            className="grid gap-2 text-paragraph font-medium"
          >
            Email:
            <input
              type="email"
              id="emailAddress"
              name="email"
              className="bg-white text-black px-4 py-3 rounded-md font-light border-none"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
          <label
            htmlFor="fullName"
            className="grid gap-2 text-paragraph font-medium"
          >
            Name:
            <input
              type="text"
              id="fullName"
              name="name"
              className="bg-white text-black px-4 py-3 rounded-md font-light border-none"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <label
            htmlFor="phoneNumber"
            className="grid gap-2 text-paragraph font-medium"
          >
            Phone:
            <input
              type="tel"
              id="phoneNumber"
              name="phone"
              className="bg-white text-black px-4 py-3 rounded-md font-light border-none"
              autoComplete="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </label>

          {!showMessage ? (
            <ButtonType
              type="button"
              cssClasses="text-paragraph font-medium px-4 py-2 rounded-md w-full tablet:self-start"
              onClick={() => setShowMessage(true)}
            >
              Next
            </ButtonType>
          ) : (
            <>
              <label
                htmlFor="message"
                className="grid gap-2 text-paragraph font-medium"
              >
                Message:
                <textarea
                  id="message"
                  name="message"
                  className="bg-white text-black px-4 py-3 rounded-md font-light border-none"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </label>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-[14px] text-red-600">{error}</p>
                </div>
              )}
              <div className="flex flex-col gap-4">
                <ButtonType type="submit">Submit</ButtonType>
                <p className="text-[14px] text-white/80">
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
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactFormComponent;
