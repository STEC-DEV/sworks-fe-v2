"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Tooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text?: string;
}) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState("center");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // 왼쪽 경계 체크
      if (tooltipRect.left < 0) {
        setPosition("left");
      }
      // 오른쪽 경계 체크
      else if (tooltipRect.right > viewportWidth) {
        setPosition("right");
      }
      // 중앙 (기본)
      else {
        setPosition("center");
      }
    } else if (!show) {
      // 툴팁이 사라질 때 position 리셋
      setPosition("center");
    }
  }, [show]);

  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "left-0";
      case "right":
        return "right-0";
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {text && show && (
        <div
          ref={tooltipRef}
          className={` absolute top-full mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-10 shadow-lg ${getPositionClasses()} `}
        >
          {text}
        </div>
      )}
    </div>
  );
}
