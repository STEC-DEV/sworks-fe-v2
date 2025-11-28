import AdminLayout from "@/components/layout/admin-layout";
import BasicInitial from "./basic-initial";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <BasicInitial />
      <AdminLayout children={children} />
    </Suspense>
  );
}
