"use client";
import ButtonLink from "@/_components/ui/buttons/button-link";

interface BackButtonProps {
  strainSlug: string;
  backUrl: string;
}

const BackButton = ({ strainSlug, backUrl }: BackButtonProps) => {
  return (
    <ButtonLink
      href={backUrl}
      cssClasses="place-self-start"
      onClick={() => sessionStorage.setItem("returnStrain", strainSlug)}
    >
      Back to Strains
    </ButtonLink>
  );
};

export default BackButton;
