"use client";

import ShowEmailAddress from "@/_components/ui/contact/show-email-address";
import ShowPhoneNumber from "@/_components/ui/contact/show-phone-number";
import Image from "next/image";
import Link from "next/link";
import ContactFormComponent from "./contact-form-component";
import classNames from "classnames";

interface ContactComponentProps {
  cssClasses?: string;
  id?: string;
}

const ContactComponent = ({ cssClasses, id }: ContactComponentProps) => {
  return (
    <section
      id={id}
      className={classNames(
        "max-w-[1280px] px-5 tablet:mx-auto tablet:grid tablet:gap-10 desktop:grid-cols-2 desktop:px-10",
        cssClasses,
      )}
    >
      <div className="grid gap-10">
        <div className="grid gap-8 place-self-start w-full tablet:grid-cols-2 tablet:gap-10 desktop:grid-cols-[1fr_1.5fr]">
          <h2 className="text-heading text-white tablet:col-span-2">Contact</h2>
          <div className="flex flex-col gap-3 items-start justify-center tablet:justify-start desktop:justify-center">
            <h3 className="text-subheading text-white">Email:</h3>
            <ShowEmailAddress />
          </div>
          <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:gap-5">
            <div className="flex flex-col gap-3 tablet:order-last">
              <div className="flex flex-col tablet:flex-row tablet:items-center tablet:gap-2">
                <h3 className="text-subheading text-white">Phone:</h3>
              </div>
              <ShowPhoneNumber />
            </div>
            <Link
              href="https://wa.me/message/56KOIRA243TID1"
              target="_blank"
              className="desktop:hover:opacity-80 desktop:justify-self-end desktop:self-center"
            >
              <Image
                src="/icons/whatsapp.png"
                alt="WhatsApp"
                width={31.5}
                height={31.5}
              />
            </Link>
          </div>
        </div>
        <div className="tablet:grid grid-cols-2 gap-10 desktop:grid-cols-1">
          <ContactFormComponent />
          <Image
            src="/images/natural-highs-clone-vault-pic-7.jpg"
            alt="Natural Highs Clone Vault"
            width={750}
            height={450}
            className="hidden tablet:block w-full h-full object-cover desktop:hidden"
          />
        </div>
      </div>
      <div className="hidden desktop:block">
        <Image
          src="/images/natural-highs-clone-vault-pic-7.jpg"
          alt="Natural Highs Clone Vault"
          width={580}
          height={400}
          className="w-full h-full object-cover aspect-video"
        />
      </div>
    </section>
  );
};

export default ContactComponent;
