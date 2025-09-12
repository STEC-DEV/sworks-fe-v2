"use client";
import React, { useEffect, useState } from "react";

interface BaseOverlayProps {
  isOpen: boolean;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  onBackClick: () => void;
}

const BaseOverlay = ({
  isOpen,
  children,
  closeOnOutsideClick = true,
  onBackClick,
}: BaseOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 브라우저가 렌더링을 완료한 후 애니메이션 시작
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10); // 약간의 지연
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // 애니메이션 지속시간보다 약간 더 길게 설정
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // 150ms + 여유시간
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: any) => {
    console.log("클릭");
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onBackClick();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4
        transition-all duration-150 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          transition-all duration-150 ease-in-out
          ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseOverlay;
