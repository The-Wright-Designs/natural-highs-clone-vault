"use client";

import { useState, useRef, useEffect } from "react";
import ButtonType from "@/_components/ui/buttons/button-type";

interface StrainDescriptionProps {
  description: string[];
}

const StrainDescription = ({ description }: StrainDescriptionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState<string>("206px");

  const fullText = description.join(" ");
  const isLong = fullText.length > 720;

  const handleExpand = () => {
    if (!expanded && contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setMaxHeight(`${scrollHeight}px`);

      const handleTransitionEnd = () => {
        setMaxHeight("none");
        contentRef.current?.removeEventListener(
          "transitionend",
          handleTransitionEnd,
        );
      };

      contentRef.current.addEventListener("transitionend", handleTransitionEnd);
      setExpanded(true);
    }
  };

  const handleCollapse = () => {
    if (expanded && contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setMaxHeight(`${scrollHeight}px`);

      requestAnimationFrame(() => {
        setMaxHeight("260px");
      });

      setExpanded(false);
    }
  };

  const toggleExpand = () => {
    if (expanded) {
      handleCollapse();
    } else {
      handleExpand();
    }
  };

  return (
    <div className="text-paragraph">
      {!isLong ? (
        <div>
          {description.map((desc, index) => (
            <p key={index} className="mb-5 last:mb-0">
              {desc}
            </p>
          ))}
        </div>
      ) : (
        <>
          <div className="relative">
            <div
              ref={contentRef}
              style={{
                maxHeight: maxHeight,
                overflow: "hidden",
                transition: expanded
                  ? "max-height 0.4s ease"
                  : "max-height 0.4s ease",
              }}
            >
              {description.map((desc, index) => (
                <p key={index} className="mb-5 last:mb-0">
                  {desc}
                </p>
              ))}
            </div>
            {!expanded && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "4rem",
                  background:
                    "linear-gradient(to bottom, transparent, #353535)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
          <button
            className="bg-white/80 text-black px-3 py-1 rounded-md mt-5 desktop:hover:cursor-pointer desktop:hover:bg-white ease-in-out duration-300"
            type="button"
            onClick={toggleExpand}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </>
      )}
    </div>
  );
};

export default StrainDescription;
