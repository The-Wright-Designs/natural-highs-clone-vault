import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t-4 border-yellow pt-10 pb-5">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-3">
        <Image
          src="/logo/natural-highs-clone-vault-logo.webp"
          alt="Natural Highs Clone Vault Logo"
          width={118}
          height={152}
          className="object-cover"
        />
        <div className="text-center">
          <p className="grid text-white text-paragraph tablet:hidden">
            © {currentYear} Natural Highs Clone Vault{" "}
            <Link className="text-white" href="/">
              www.naturalhighs.co.za
            </Link>
          </p>
          <p className="hidden text-white text-paragraph tablet:block">
            © {currentYear} Natural Highs Clone Vault |{" "}
            <Link className="text-white" href="/">
              www.naturalhighs.co.za
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
