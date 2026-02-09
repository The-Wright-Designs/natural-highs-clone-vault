import LatestStrainsSlider from "@/_components/home-page/latest-strains/latest-strains-slider";
import ButtonLink from "@/_components/ui/buttons/button-link";

import strainsData from "@/_data/strains-data.json";

const LatestStrainsSection = () => {
  return (
    <section className="max-w-[1280px] mx-auto px-5 desktop:px-10">
      <div className=" py-10 border-y-4 border-green grid gap-10">
        <h3 className="text-heading">Latest Strains</h3>
        <LatestStrainsSlider
          data={strainsData.slice(0, 8)}
          cssClasses="overflow-hidden"
        />
        <ButtonLink href="/strains" cssClasses="desktop:place-self-center">
          View All Strains
        </ButtonLink>
      </div>
    </section>
  );
};

export default LatestStrainsSection;
