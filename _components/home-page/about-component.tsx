import classNames from "classnames";
import Image from "next/image";

interface AboutComponentProps {
  cssClasses?: string;
  id?: string;
}

export default function AboutComponent({
  cssClasses,
  id,
}: AboutComponentProps) {
  return (
    <main id={id} className={classNames("max-w-[1280px] mx-auto", cssClasses)}>
      <div className="mx-5 border-t-4 border-green py-10 grid gap-10 desktop:mx-10 desktop:border-none desktop:py-0 desktop:grid-cols-2">
        <h3 className="text-heading col-span-full">About</h3>
        <div className="grid gap-10 tablet:grid-cols-2 desktop:grid-cols-1 desktop:col-span-full">
          <div className="flex flex-col gap-4">
            <p>
              At <span className="font-bold">Natural Highs Clone Vault</span>,
              we take pride in carefully pheno-hunting top-tier genetics from
              around the world, making them available as premium cannabis clones
              for sale to South African growers who want to cultivate at home
              with confidence.
            </p>
            <p>
              Every clone we offer is hand-selected for vigour, stability, and
              exceptional traits — from high yields and rich terpene profiles to
              resilience and consistency. Our mission is to empower growers of
              all levels with reliable, healthy clones that give you a head
              start on your cultivation journey.
            </p>
            <p>
              Whether you're an experienced grower or just starting out and
              searching for where to buy quality cannabis clones and seeds,{" "}
              <span className="font-bold">Natural Highs Clone Vault</span>{" "}
              ensures you get premium genetics that set the foundation for
              success. With a focus on quality, integrity, and innovation, we
              aim to build a trusted community where passionate cultivators in
              South Africa can access world-class genetics and grow with
              confidence.
            </p>
          </div>
          <div className="grid gap-10 desktop:grid-cols-3">
            <Image
              src="/images/natural-highs-clone-vault-pic-3.jpg"
              alt="About Natural Highs Clone Vault"
              width={380}
              height={300}
              className="hidden desktop:block object-cover desktop:aspect-[4/3.5]"
            />
            <Image
              src="/images/natural-highs-clone-vault-pic-2.jpg"
              alt="About Natural Highs Clone Vault"
              width={800}
              height={600}
              className="object-cover h-full aspect-[4/2.5] tablet:aspect-[4/2] desktop:aspect-[4/3.5]"
              sizes="(max-width:800px) 100vw, (max-width:1280px) 50vw, 640px"
            />
            <Image
              src="/images/natural-highs-clone-vault-pic-4.png"
              alt="About Natural Highs Clone Vault"
              width={380}
              height={300}
              className="hidden desktop:block object-cover desktop:aspect-[4/3.5]"
            />
          </div>
        </div>
        <div className="grid gap-10 tablet:grid-cols-2 desktop:grid-cols-1">
          <div className="flex flex-col gap-5 tablet:order-last desktop:order-first">
            <h3>Why Natural Highs Clone Vault?</h3>
            <p>
              We’re dedicated to providing South African cannabis growers with a
              simple and dependable way to access world-class genetics. By
              offering hand-selected, rooted clones instead of unverified seeds
              or cuttings, we remove the guesswork and help growers of all
              experience levels achieve success. Our focus on quality,
              integrity, and innovation means you can buy premium cannabis
              clones with confidence and enjoy a smoother path to thriving
              plants and exceptional harvests.
            </p>
          </div>
          <div>
            <Image
              src="/images/natural-highs-clone-vault-pic-5.jpg"
              alt="About Natural Highs Clone Vault"
              width={800}
              height={600}
              className="object-cover h-full aspect-[4/2.5] tablet:aspect-[4/2.5]"
              sizes="(max-width:800px) 100vw, (max-width:1280px) 50vw, 640px"
            />
          </div>
        </div>
        <div className="grid gap-10 tablet:grid-cols-2 desktop:grid-cols-1">
          <div className="flex flex-col gap-5">
            <h3>Why our strains are unique</h3>
            <div className="flex flex-col gap-4">
              <p>
                Every strain we offer is the result of a rigorous pheno-hunting
                process designed to identify the very best cannabis traits. We
                source rare and exceptional cannabis genetics, selecting
                phenotypes that combine high yields, robust growth, and standout
                terpene profiles while thriving in South African growing
                conditions.
              </p>
              <p>
                The result is a range of exclusive cannabis clones that deliver
                consistent performance and a truly premium cultivation
                experience.
              </p>
            </div>
          </div>
          <div className="hidden tablet:block">
            <Image
              src="/images/natural-highs-clone-vault-pic-1.jpg"
              alt="About Natural Highs Clone Vault"
              width={800}
              height={600}
              className="h-full object-cover aspect-[4/2.5] tablet:aspect-[4/2] desktop:aspect-[4/1.75]"
              sizes="(max-width:800px) 100vw, (max-width:1280px) 50vw, 640px"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
