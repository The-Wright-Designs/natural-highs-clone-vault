"use client";

import { useRouter } from "next/navigation";
import { buttonStyles } from "@/_styles/button-styles";

interface BackButtonProps {
  strainSlug: string;
  backUrl: string;
}

const BackButton = ({ strainSlug, backUrl }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    sessionStorage.setItem("returnStrain", strainSlug);

    const stateStr = sessionStorage.getItem("strainsNavState");
    if (stateStr) {
      const state = JSON.parse(stateStr) as {
        page: number;
        filter: string;
        searchTerm: string;
      };
      sessionStorage.removeItem("strainsNavState");
      const params = new URLSearchParams();
      params.set("page", String(state.page));
      params.set("filter", state.filter);
      if (state.searchTerm) params.set("search", state.searchTerm);
      router.push(`/strains?${params.toString()}`);
    } else {
      router.push(backUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={buttonStyles("place-self-start")}
      style={{ fontVariant: "small-caps" }}
    >
      Back to Strains
    </button>
  );
};

export default BackButton;
