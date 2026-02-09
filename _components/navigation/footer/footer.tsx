import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t-4 border-green pt-10 pb-5">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-3">
        <Image
          src="/logo/natural-highs-clone-vault-logo.png"
          alt="Natural Highs Clone Vault Logo"
          width={150}
          height={200}
          className="object-cover"
        />
        <p className="text-paragraph pb-3 border-b border-white/25 text-white text-center tablet:flex tablet:gap-1">
          Designed &amp; developed by
          <br className="desktop:hidden" />
          <Link
            href="https://thewrightdesigns.co.za"
            className="text-white underline underline-offset-4 desktop:hover:text-green ease-in-out duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Wright Designs
          </Link>
        </p>
        <div className="text-center">
          <p className="grid text-white text-paragraph tablet:hidden">
            © {currentYear} Natural Highs Clone Vault{" "}
            <Link className="text-white" href="/">
              www.naturalhighs.co.za
            </Link>
          </p>
          <p className="hidden text-white text-paragraph tablet:block">
            © {currentYear} Natural Highs Clone Vault |{" "}
            <Link className="text-white hover:text-green" href="/">
              www.naturalhighs.co.za
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
