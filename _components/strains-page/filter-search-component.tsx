"use client";

import { useState, useEffect } from "react";

interface FilterSearchComponentProps {
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (search: string, filteredResults?: any[]) => void;
  strains?: any[];
  currentSearch?: string;
  currentFilter?: string;
}

const FilterSearchComponent = ({
  onFilterChange,
  onSearchChange,
  strains = [],
  currentSearch = "",
  currentFilter = "Latest",
}: FilterSearchComponentProps) => {
  const [selectedFilter, setSelectedFilter] = useState(currentFilter);
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setSelectedFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearching(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchTerm.trim()) {
        onSearchChange?.(searchTerm, strains);
      } else {
        const titleMatches = strains.filter((strain) =>
          strain.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        const descriptionMatches = strains.filter(
          (strain) =>
            !strain.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            strain.description.some((desc: string) =>
              desc.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        );
        const filteredResults = [...titleMatches, ...descriptionMatches];
        onSearchChange?.(searchTerm, filteredResults);
      }
      setIsSearching(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchTerm, onSearchChange, strains]);

  return (
    <div className="flex flex-col gap-10 py-10 relative border-y-4 border-green tablet:flex-row tablet:justify-start tablet:border-t-4 tablet:border-b-0 tablet:pb-0 tablet:pt-10">
      <div className="relative rounded-md w-full tablet:w-[200px]">
        <div className="flex items-center justify-between px-3 py-2.5 relative w-full">
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="bg-transparent text-transparent text-paragraph appearance-none w-full focus:outline-none cursor-pointer absolute inset-0 px-3 py-2.5"
          >
            <option value="Latest" className="bg-black text-white">
              Latest
            </option>
            <option value="A-Z" className="bg-black text-white">
              A-Z
            </option>
            <option value="Price High to Low" className="bg-black text-white">
              Price - High to low
            </option>
            <option value="Price Low to High" className="bg-black text-white">
              Price - Low to high
            </option>
          </select>
          <div className="flex items-center justify-between w-full pointer-events-none">
            <span className="text-white text-paragraph">{selectedFilter}</span>
            <div className="ml-2 flex h-[9.984px] items-center justify-center shrink-0 w-[16.984px]">
              <div className="rotate-[270deg]">
                <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
                  <path
                    d="M8.5 1L1.5 8L8.5 15"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute border border-green border-solid inset-0 pointer-events-none rounded-md" />
      </div>

      <div className="flex flex-col gap-2 w-full tablet:w-auto tablet:flex-row tablet:items-center tablet:gap-5">
        <div className="relative rounded-md">
          <div className="flex items-center justify-between px-3 py-2.5 relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Find a strain..."
              className="bg-transparent text-white text-paragraph placeholder:text-white/50 w-full focus:outline-none"
            />
            <div className="shrink-0 ml-2  w-6 h-6 pointer-events-none">
              {isSearching ? (
                <div className="spinner-green" />
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_3316_166"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_3316_166)">
                    <path
                      d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                      fill="#FFFFFF"
                    />
                  </g>
                </svg>
              )}
            </div>
          </div>
          <div className="absolute border border-green border-solid inset-0 pointer-events-none rounded-md" />
        </div>

        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="bg-green px-3 py-1 rounded-md self-start tablet:self-auto hover:cursor-pointer ease-in-out duration-300 tablet:hover:opacity-80"
          >
            <span className="text-black text-[14px] text-subheading">
              Clear
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSearchComponent;
