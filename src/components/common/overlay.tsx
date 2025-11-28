"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
      // body 스크롤 방지
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // 애니메이션 후 언마운트
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "";
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC 키 처리
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBackClick();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onBackClick]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onBackClick();
    }
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 transition-all duration-150 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        // zIndex: 2147483647,
        zIndex: 51,
        pointerEvents: "auto",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="transition-all duration-150 ease-in-out"
        style={{
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          opacity: isVisible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default BaseOverlay;
