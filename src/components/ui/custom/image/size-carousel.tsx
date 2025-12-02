"use client";
import IconButton from "@/components/common/icon-button";
import BaseOverlay from "@/components/common/overlay";
import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../../scroll-area";
import { createPortal } from "react-dom";
import Image from "next/image";

interface DialogCarouselProps {
  currentIndex?: number;
  pathList: string[];
  imageTxt?: string[];
  isSmall?: boolean;
}

const DialogCarousel = ({
  pathList,
  imageTxt,
  isSmall = false,
}: DialogCarouselProps) => {
  const [index, setIndex] = useState<number>(0);
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
    <div className="w-full flex-1">
      <ScrollArea className="w-full overflow-hidden">
        <div className="flex gap-4 ">
          {pathList.map((v, i) => (
            <ImageBox
              key={i}
              src={v}
              description={imageTxt?.[i]}
              onClick={() => {
                setIndex(i); // 클릭한 이미지로 인덱스 설정
                setOpen(true);
              }}
              isSmall={isSmall}
            />
          ))}
        </div>
        <ScrollBar
          className="absolute bottom-0 left-0"
          orientation="horizontal"
        />
      </ScrollArea>

      {open ? (
        <BaseOverlay
          isOpen={open}
          onBackClick={() => {
            setOpen(false);
          }}
        >
          <div className="relative">
            <div className="relative max-w-[80vw] max-h-[80vh]">
              <Image
                src={pathList[index]}
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                }}
                alt="이미지"
              />
            </div>
          </div>
        </BaseOverlay>
      ) : null}
      {open &&
        createPortal(
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
          </>,
          document.body
        )}
    </div>
  );
};

const ImageBox = ({
  src,
  description,
  isSmall = false,
  onClick,
}: {
  src: string;
  description?: string;
  isSmall?: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="flex flex-col gap-1 overflow-hidden last flex-shrink-0">
      <div
        className="border border-[var(--border)] rounded-[4px] overflow-hidden last flex-shrink-0 relative"
        onClick={onClick}
      >
        {isSmall ? (
          <Image
            width={64} // w-16 = 64px
            height={64}
            className="w-16 h-16 object-cover aspect-square"
            src={src}
            alt="이미지"
          />
        ) : (
          <Image
            width={192} // w-48 = 12rem = 192px
            height={128} // h-32 = 8rem = 128px
            className="h-32 w-48 object-cover"
            src={src}
            alt="이미지"
          />
        )}
      </div>
      <span className="text-xs text-[var(--description-light)]">
        {description}
      </span>
    </div>
  );
};

export default DialogCarousel;
