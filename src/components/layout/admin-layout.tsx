"use client";
import React from "react";
import SideBar, { MobileSidebar } from "../ui/custom/side-bar/side-bar";
import { ScrollArea } from "../ui/scroll-area";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="hidden xl:block">
        <SideBar loginMode="ADMIN" />
      </div>
      <ScrollArea
        className="w-full h-full overflow-hidden "
        style={{ height: "100%" }}
      >
        <div className="flex flex-col gap-6 px-6 py-6 xl:px-12 xl:py-12 w-full h-full overflow-auto">
          <div className="flex justify-between items-center xl:hidden pt-1">
            <span className=" px-2 py-1 rounded-[4px] font-bold  tracking-tighter">
              S-Agent
            </span>
            <MobileSidebar type="ADMIN" />
          </div>
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminLayout;
