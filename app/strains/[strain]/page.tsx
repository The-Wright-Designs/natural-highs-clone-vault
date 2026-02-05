import { Metadata } from "next";
import { notFound } from "next/navigation";

import StrainSlider from "@/_components/strain-page/strain-slider";
import StrainCartComponent from "@/_lib/utils/strain-cart-component";
import StockAvailabilityBadges from "@/_components/ui/badges/stock-availability-badges";
import ButtonLink from "@/_components/ui/buttons/button-link";
import StrainDetails from "@/_components/strains-page/strain-details";
import StrainDescription from "@/_components/strain-page/strain-description";
import { createStrainMetadata } from "@/_lib/metadata";

import strainData from "@/_data/strains-data.json";

interface StrainPageProps {
  params: Promise<{ strain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return strainData.map((strain) => ({
    strain: strain.title.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: StrainPageProps): Promise<Metadata> {
  const { strain: strainSlug } = await params;
  const strain = strainData.find(
    (strain) => strain.title.toLowerCase().replace(/\s+/g, "-") === strainSlug,
  );

  if (!strain) {
    return {
      title: "Strain Not Found | Natural Highs Clone Vault",
      description: "The requested cannabis strain could not be found.",
    };
  }

  return createStrainMetadata(strain);
}

const StrainPage = async ({ params, searchParams }: StrainPageProps) => {
  const { strain: strainSlug } = await params;
  const searchParam = await searchParams;

  const strain = strainData.find(
    (strain) => strain.title.toLowerCase().replace(/\s+/g, "-") === strainSlug,
  );

  if (!strain) {
    notFound();
  }

  const buildBackUrl = () => {
    const params = new URLSearchParams();

    if (searchParam.page) {
      params.set("page", searchParam.page as string);
    }
    if (searchParam.filter) {
      params.set("filter", searchParam.filter as string);
    }
    if (searchParam.search) {
      params.set("search", searchParam.search as string);
    }

    params.set("returnStrain", strainSlug);

    const queryString = params.toString();
    return queryString ? `/strains?${queryString}` : "/strains";
  };

  return (
    <div className="max-w-[1280px] mx-auto px-5 desktop:px-10 py-15">
      <div className="mb-10">
        <ButtonLink href={buildBackUrl()} cssClasses="place-self-start">
          Back to Strains
        </ButtonLink>
      </div>
      <div className="space-y-5 desktop:grid grid-cols-[480px_1fr] desktop:gap-x-10 desktop:gap-y-5">
        <div className="flex w-full flex-col pb-5 border-b-4 border-yellow desktop:place-self-start">
          <h2 className="text-heading">{strain.title}</h2>
          <p
            className="text-subheading font-light"
            style={{ fontVariant: "small-caps" }}
          >
            {strain.supplier}
          </p>
        </div>
        <div className="desktop:overflow-hidden desktop:order-first desktop:row-span-2">
          <StrainSlider data={strain.images} />
        </div>
        <div className="flex flex-col gap-10 text-white">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center gap-5 desktop:justify-start desktop:gap-10">
              <p className="text-heading">R{strain.price}</p>
              <StockAvailabilityBadges inStock={strain.inStock} />
            </div>

            <StrainDescription description={strain.description} />
          </div>
          <StrainCartComponent
            strainId={strainSlug}
            strainName={strain.title}
            strainPrice={strain.price}
            strainImage={strain.images[0]}
            inStock={strain.inStock}
            cssClasses="desktop:justify-start"
          />
        </div>
        <StrainDetails
          strain={strain}
          cssClasses="grid gap-5 text-paragraph pt-10 mt-10 border-t-4 border-yellow desktop:col-span-2 desktop:gap-x-10 desktop:gap-y-5 desktop:grid-cols-[480px_1fr] desktop:mt-0 desktop:pt-0 desktop:border-t-0"
        />
      </div>
    </div>
  );
};

export default StrainPage;
