import Image from "next/image";

import { StrainProps } from "@/_types/general-types";
import Link from "next/link";
import StrainCartComponent from "@/_lib/utils/strain-cart-component";
import StockAvailabilityBadges from "@/_components/ui/badges/stock-availability-badges";
import { createStrainSlug } from "@/_lib/utils/slug-utils";

interface StrainComponentProps {
  strainData: StrainProps;
  currentPage?: number;
  filter?: string;
  searchTerm?: string;
}

const StrainComponent = ({
  strainData,
  currentPage = 1,
  filter = "Latest",
  searchTerm = "",
}: StrainComponentProps) => {
  const strainSlug = createStrainSlug(strainData.title);

  const buildStrainUrl = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("filter", filter);
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    return `/strains/${strainSlug}?${params.toString()}`;
  };
  return (
    <li
      id={`strain-${strainSlug}`}
      className="flex flex-col gap-5 items-start justify-center relative w-full border-b border-green/25 pb-10 min-[550px]:border-b-0 min-[550px]:pb-0"
    >
      <Link
        href={buildStrainUrl()}
        className="overflow-hidden w-full aspect-square"
      >
        <Image
          src={strainData.images[0]}
          alt={strainData.title}
          width={550}
          height={550}
          className="object-cover bg-white desktop:hover:scale-105 delay-75 ease-in-out duration-300 h-full w-full"
          sizes="(max-width: 800px) 100vw, (min-width: 800px) 50vw, (min-width: 1000px) 400px"
        />
      </Link>
      <Link href={buildStrainUrl()}>
        <div className="min-[1000px]:absolute top-3 right-3">
          <StockAvailabilityBadges inStock={strainData.inStock} />
        </div>
      </Link>
      <Link
        href={buildStrainUrl()}
        className="desktop:hover:opacity-80 ease-in-out duration-300"
      >
        <div className="flex flex-col text-white w-full">
          <h3 className="text-subheading">{strainData.title}</h3>
          <p className="text-paragraph">{strainData.supplier}</p>
          <p className="text-paragraph">R{strainData.price}</p>
        </div>
      </Link>
      <StrainCartComponent
        strainId={strainSlug}
        strainName={strainData.title}
        strainPrice={strainData.price}
        strainImage={strainData.images[0]}
        inStock={strainData.inStock}
      />
    </li>
  );
};

export default StrainComponent;
