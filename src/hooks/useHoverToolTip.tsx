"use client";
import { useRef, useState } from "react";

export const useHoverTooltip = () => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [showLeft, setShowLeft] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHover(true);

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const spaceOnRight = windowWidth - rect.right;

      // 오른쪽 공간이 부족하면 왼쪽에 표시 (200px는 호버 메뉴 예상 너비)
      setShowLeft(spaceOnRight < 200);
    }
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return { isHover, showLeft, ref, handleMouseEnter, handleMouseLeave };
};
