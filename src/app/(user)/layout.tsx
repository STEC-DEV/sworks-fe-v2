import NormalLayout from "@/components/layout/normal-layout";
import { SSEProvider } from "@/components/layout/sse-provider";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <SSEProvider>
        <NormalLayout>{children}</NormalLayout>
      </SSEProvider>
    </Suspense>
  );
}
