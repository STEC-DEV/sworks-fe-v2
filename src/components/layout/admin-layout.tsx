import React from "react";
import SideBar from "../ui/custom/side-bar/side-bar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <SideBar loginMode="ADMIN" />
      <div className="flex flex-col gap-6 px-36 py-12 w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
