"use client";
import React, { useState } from "react";
import SideBar from "../ui/custom/side-bar/side-bar";

import IconButton from "../common/icon-button";

interface NormalLayoutProps {
  children: React.ReactNode;
}

const NormalLayout = ({ children }: NormalLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="hidden xl:block">
        <SideBar loginMode="NORMAL" />
      </div>
      {/* Mobile Sidebar - 오버레이 형태 */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 xl:hidden
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <SideBar loginMode="NORMAL" />
      </div>

      {/* 오버레이 배경 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-30 xl:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex flex-col gap-6 px-12  xl:px-36 xl:py-12 w-full h-full overflow-auto">
        <div className="flex justify-end xl:hidden pt-1">
          <IconButton icon="Menu" size={24} onClick={toggleSidebar} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default NormalLayout;
