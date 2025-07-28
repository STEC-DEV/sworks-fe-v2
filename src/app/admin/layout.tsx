import AdminLayout from "@/components/layout/admin-layout";
import BasicInitial from "./basic-initial";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BasicInitial />
      <AdminLayout children={children} />
    </>
  );
}
