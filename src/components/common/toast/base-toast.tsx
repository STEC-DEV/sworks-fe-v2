import { Toaster } from "@/components/ui/sonner";
import React from "react";

const BaseToast = () => {
  return (
    <Toaster
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "var(--description-dark)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          error: "!bg-red-500 !text-white",
          success: "!bg-green-500 !text-white",
          warning: "!bg-yellow-500 !text-black",
          info: "!bg-blue-500 !text-white",
        },
      }}
      duration={1500}
    />
  );
};

export default BaseToast;
