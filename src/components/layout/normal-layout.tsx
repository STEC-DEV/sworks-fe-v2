"use client";
import React from "react";
import SideBar, { MobileSidebar } from "../ui/custom/side-bar/side-bar";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { QueryProvider } from "@/providers/QueryProvider";

interface NormalLayoutProps {
  children: React.ReactNode;
}

const NormalLayout = ({ children }: NormalLayoutProps) => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="hidden xl:block">
        <SideBar loginMode="NORMAL" />
      </div>
      <QueryProvider>
        <ScrollArea
          className=" w-full  overflow-hidden "
          style={{ height: "100%" }}
        >
          <div className="bg-background flex flex-col gap-6 px-6 py-6 xl:px-8 xl:py-12 w-full min-h-full ">
            <div className="flex justify-between items-center xl:hidden pt-1">
              <span
                className=" px-2 py-1 rounded-[4px] font-bold  tracking-tighter cursor-pointer"
                onClick={() => router.push(`/schedule`)}
              >
                S-Agent
              </span>
              {/* <IconButton icon="Menu" size={24} onClick={toggleSidebar} /> */}
              <MobileSidebar type="NORMAL" />
            </div>
            {children}
          </div>
        </ScrollArea>
      </QueryProvider>
    </div>
  );
};

export default NormalLayout;
