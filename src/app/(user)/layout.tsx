import NormalLayout from "@/components/layout/normal-layout";
import { SSEProvider } from "@/components/layout/sse-provider";
import { Suspense } from "react";
import BasicInitial from "./basic-initial";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <SSEProvider>
        <BasicInitial />
        <NormalLayout>{children}</NormalLayout>
      </SSEProvider>
    </Suspense>
  );
}
