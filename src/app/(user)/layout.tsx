import NormalLayout from "@/components/layout/normal-layout";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <NormalLayout>{children}</NormalLayout>
    </Suspense>
  );
}
