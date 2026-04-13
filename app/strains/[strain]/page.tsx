import { Metadata } from "next";
import { notFound } from "next/navigation";

import StrainSlider from "@/_components/strain-page/strain-slider";
import StrainCartComponent from "@/_lib/utils/strain-cart-component";
import StockAvailabilityBadges from "@/_components/ui/badges/stock-availability-badges";
import ButtonLink from "@/_components/ui/buttons/button-link";
import StrainDetails from "@/_components/strains-page/strain-details";
import StrainDescription from "@/_components/strain-page/strain-description";
import { createStrainMetadata } from "@/_lib/metadata";
import { createStrainSlug } from "@/_lib/utils/slug-utils";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/_lib/seo-utils";
import { siteConfig } from "@/_lib/metadata";

import strainData from "@/_data/strains-data.json";
import Link from "next/link";
import Image from "next/image";

interface StrainPageProps {
  params: Promise<{ strain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return strainData.map((strain) => ({
    strain: createStrainSlug(strain.title),
  }));
}

export async function generateMetadata({
  params,
}: StrainPageProps): Promise<Metadata> {
  const { strain: strainSlug } = await params;
  const strain = strainData.find(
    (strain) => createStrainSlug(strain.title) === strainSlug,
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
    (strain) => createStrainSlug(strain.title) === strainSlug,
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

  const schema = generateProductSchema({
    ...strain,
    type: strain.type ?? "",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Strains", url: `${siteConfig.url}/strains` },
    {
      name: strain.title,
      url: `${siteConfig.url}/strains/${strainSlug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-[1280px] desktop:mx-auto px-5 desktop:px-10 py-15">
        <div className="mb-10">
          <ButtonLink href={buildBackUrl()} cssClasses="place-self-start">
            Back to Strains
          </ButtonLink>
        </div>
        <div className="flex flex-col gap-5 desktop:grid desktop:grid-cols-[480px_1fr] desktop:gap-x-10 desktop:gap-y-5">
          <div className="flex w-full flex-col pb-5 border-b-4 border-green desktop:place-self-start">
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
              {strain.certificate && (
                <Link
                  href={strain.certificate}
                  aria-label={`${strain.title} Certificate of Analysis`}
                  target="_blank"
                  className="text-[18px] self-start p-2 -m-2 underline decoration-green underline-offset-4 desktop:p-0 desktop:m-0 desktop:hover:opacity-80 ease-in-out duration-300"
                >
                  <span className="text-[18px] font-semibold">HLVd</span>
                  {"  "}
                  Certificate
                  <Image
                    src="/icons/li_external-link.svg"
                    alt="External Link Icon"
                    width={18}
                    height={18}
                    className="inline-block ml-1 mb-0.5"
                  />
                </Link>
              )}
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
            cssClasses="grid gap-5 text-paragraph pt-10 mt-10 border-t-4 border-green desktop:col-span-2 desktop:gap-x-10 desktop:gap-y-5 desktop:grid-cols-[480px_1fr] desktop:mt-0 desktop:pt-0 desktop:border-t-0"
          />
        </div>
      </div>
    </>
  );
};

export default StrainPage;
