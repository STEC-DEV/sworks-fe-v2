"use client";
import IconButton from "@/components/common/icon-button";
import BaseOverlay from "@/components/common/overlay";
import React, { useState } from "react";

interface DialogCarouselProps {
  currentIndex: number;
  pathList: string[];
}

const DialogCarousel = ({ currentIndex, pathList }: DialogCarouselProps) => {
  const [index, setIndex] = useState<number>(currentIndex);
  const [open, setOpen] = useState<boolean>(false);

  const handlePrev = () => {
    setIndex((prev) => {
      if (prev === 0) return prev;
      else {
        return prev - 1;
      }
    });
  };

  const handleNext = () => {
    setIndex((prev) => {
      if (prev === pathList.length - 1) return prev;
      else {
        return prev + 1;
      }
    });
  };
  return (
    <div>
      <div
        className="border border-[var(--border)] rounded-[4px] overflow-hidden last"
        onClick={() => setOpen(true)}
      >
        <img className="h-32 w-48 object-cover" src={pathList[currentIndex]} />
      </div>
      {open ? (
        <BaseOverlay
          isOpen={open}
          onBackClick={() => {
            setOpen(false);
          }}
        >
          <div className="relative">
            <img
              src={pathList[index]}
              className="max-w-[80vw] max-h-[80vh] object-contain"
            />
          </div>
        </BaseOverlay>
      ) : null}
      {open && (
        <>
          {pathList.length > 1 ? (
            <>
              <IconButton
                bgClassName="fixed top-1/2 -translate-y-1/2 left-4 bg-gray-50 opacity-50 hover:opacity-100 z-[60]"
                icon="ChevronLeft"
                size={30}
                onClick={(e) => {
                  e.stopPropagation();

                  // 이전 이미지 로직
                  handlePrev();
                }}
              />
              <IconButton
                bgClassName="fixed top-1/2 -translate-y-1/2 right-4 bg-gray-50 opacity-50 hover:opacity-100 z-[60]"
                icon="ChevronRight"
                size={30}
                onClick={(e) => {
                  e.stopPropagation();
                  // 다음 이미지 로직
                  handleNext();
                }}
              />
            </>
          ) : null}

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white z-[60] tabular-nums">
            <span className="text-xl ">
              {index + 1}/{pathList.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default DialogCarousel;
