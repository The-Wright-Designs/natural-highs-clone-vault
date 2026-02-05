"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterSearchComponent from "@/_components/strains-page/filter-search-component";
import StrainComponent from "@/_components/strains-page/strain-component";
import PaginationComponent from "@/_components/strains-page/pagination-component";

import strainData from "@/_data/strains-data.json";

const StrainsPageLoading = () => (
  <div className="max-w-[1280px] grid gap-15 py-15 mx-auto px-5 desktop:px-10">
    <div className="grid gap-10">
      <h2>Strains</h2>
      <div className="animate-pulse">
        <div className="h-10 bg-yellow/25 rounded mb-4"></div>
        <div className="h-10 bg-yellow/25 rounded"></div>
      </div>
    </div>
    <div className="grid gap-10 grid-cols-1 tablet:grid-cols-2 min-[1000px]:grid-cols-3">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-64 bg-yellow/25 rounded mb-4"></div>
          <div className="h-4 bg-yellow/25 rounded mb-2"></div>
          <div className="h-4 bg-yellow/25 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

const StrainsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const filterParam = searchParams.get("filter");
    const searchParam = searchParams.get("search");

    console.log(
      "URL params - page:",
      pageParam,
      "filter:",
      filterParam,
      "search:",
      searchParam,
    );

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        console.log("Setting current page to:", page);
        setCurrentPage(page);
      }
    }

    if (filterParam) {
      console.log("Setting filter to:", filterParam);
      setFilter(filterParam);
    }

    if (searchParam) {
      console.log("Setting search to:", searchParam);
      setSearchTerm(searchParam);
    }

    setTimeout(() => setIsInitialized(true), 100);
  }, [searchParams]);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("filter", filter);
    if (searchTerm) {
      params.set("search", searchTerm);
    }

    router.replace(`/strains?${params.toString()}`);
  }, [isInitialized, currentPage, filter, searchTerm, router]);

  const handleFilterChange = (newFilter: string) => {
    if (isInitialized && newFilter !== filter) {
      setFilter(newFilter);
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (newSearch: string) => {
    if (isInitialized && newSearch !== searchTerm) {
      setSearchTerm(newSearch);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  };

  const filteredStrains = useMemo(() => {
    let filtered = [...strainData];

    if (searchTerm) {
      filtered = filtered.filter(
        (strain) =>
          strain.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          strain.description.some((desc) =>
            desc.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    switch (filter) {
      case "A-Z":
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Price High to Low":
        filtered = filtered.sort((a, b) => {
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          return b.price - a.price;
        });
        break;
      case "Price Low to High":
        filtered = filtered.sort((a, b) => {
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          return a.price - b.price;
        });
        break;
      case "Latest":
      default:
        filtered = filtered.sort((a, b) => {
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [filter, searchTerm]);

  const validStrains = useMemo(() => {
    return filteredStrains.filter(
      (item) =>
        item.images[0] !== "" &&
        item.title !== "" &&
        item.price !== null &&
        item.supplier !== "",
    );
  }, [filteredStrains]);

  const totalPages = Math.ceil(validStrains.length / itemsPerPage);

  const currentStrains = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return validStrains.slice(startIndex, endIndex);
  }, [validStrains, currentPage, itemsPerPage]);

  useEffect(() => {
    if (!isInitialized) return;

    const returnStrain = searchParams.get("returnStrain");
    if (returnStrain) {
      console.log("Return strain found:", returnStrain);
      console.log("Current page:", currentPage);
      console.log("Current filter:", filter);
      console.log("Current search:", searchTerm);
      console.log(
        "Strains on current page:",
        currentStrains.map((s) => s.title),
      );

      setTimeout(() => {
        const element = document.getElementById(`strain-${returnStrain}`);
        console.log("Looking for element:", `strain-${returnStrain}`);
        console.log("Element found:", !!element);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("returnStrain");
          window.history.replaceState({}, "", newUrl.toString());
        } else {
          console.log(
            "Element not found, available strains:",
            Array.from(document.querySelectorAll('[id^="strain-"]')).map(
              (el) => el.id,
            ),
          );
        }
      }, 500);
    }
  }, [
    searchParams,
    currentPage,
    filter,
    searchTerm,
    isInitialized,
    currentStrains,
  ]);

  return (
    <div className="max-w-[1280px] grid gap-15 py-15 mx-auto px-5 desktop:px-10">
      <div className="grid gap-10">
        <h2>Strains</h2>
        <FilterSearchComponent
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          strains={validStrains}
          currentSearch={searchTerm}
          currentFilter={filter}
        />
      </div>
      {currentStrains.length > 0 ? (
        <>
          <ul className="grid gap-10 grid-cols-1 place-items-start tablet:gap-15 tablet:grid-cols-2 min-[1000px]:grid-cols-3">
            {currentStrains.map((strain) => (
              <StrainComponent
                key={strain.title.toLowerCase().replace(/\s+/g, "-")}
                strainData={strain}
                currentPage={currentPage}
                filter={filter}
                searchTerm={searchTerm}
              />
            ))}
          </ul>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : searchTerm ? (
        <div className="flex w-full h-[250px] justify-center items-center">
          <p>Sorry, no strains match your search.</p>
        </div>
      ) : null}
    </div>
  );
};

const Strains = () => (
  <Suspense fallback={<StrainsPageLoading />}>
    <StrainsContent />
  </Suspense>
);

export default Strains;
