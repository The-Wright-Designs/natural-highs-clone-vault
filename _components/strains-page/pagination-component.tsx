"use client";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleFirst = () => {
    onPageChange(1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleLast = () => {
    onPageChange(totalPages);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-4 mt-10 flex-wrap">
      <button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className={`flex h-10 w-16 justify-center items-center rounded-md text-paragraph desktop:h-8 transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "bg-black text-white border-2 border-green desktop:hover:bg-green desktop:hover:text-black desktop:hover:cursor-pointer"
        }`}
      >
        First
      </button>

      <div className="flex gap-5 desktop:gap-2.5">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex justify-center items-center size-10 text-white text-paragraph desktop:size-8"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => {
                onPageChange(page as number);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className={`flex justify-center items-center size-10 rounded-md text-paragraph desktop:size-8 transition-all duration-300 ${
                currentPage === page
                  ? "bg-green text-black"
                  : "bg-black text-white border-2 border-green desktop:hover:bg-green desktop:hover:text-black desktop:hover:cursor-pointer"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className={`flex h-10 w-16 justify-center items-center rounded-md text-paragraph desktop:h-8 transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "bg-black text-white border-2 border-green desktop:hover:bg-green desktop:hover:text-black desktop:hover:cursor-pointer"
        }`}
      >
        Last
      </button>
    </div>
  );
};

export default PaginationComponent;
