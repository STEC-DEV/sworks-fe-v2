import React from "react";
import ProfileCard from "./_components/profile/profile-card";
import AdminWorkplaceList from "./_components/admin-workplace";

const Page = () => {
  return (
    <div className="flex gap-12">
      <ProfileCard />
      <AdminWorkplaceList />
    </div>
  );
};

export default Page;
