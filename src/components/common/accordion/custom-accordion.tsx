"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomAccordionProps {
  icon?: LucideIcon;
  label: string;
  optionChildren?: React.ReactNode;
  children: React.ReactNode;
  isPaddingBottom?: boolean;
}

const CustomAccordion = ({
  icon,
  label,
  children,
  optionChildren,
  isPaddingBottom = true,
}: CustomAccordionProps) => {
  const Icon = icon;
  return (
    <Accordion
      type="single"
      collapsible
      className="border border-[var(--border)] rounded-[4px] shadow-sm bg-white w-full"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger
          className={`px-6 py-2 hover:no-underline items-center focus-visible:ring-0 focus-visible:outline-none ${
            !optionChildren && "py-4"
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
              {Icon ? (
                <Icon className="w-5 h-5 text-blue-500 " strokeWidth={1.5} />
              ) : null}

              <span className="text-sm font-normal">{label}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>{optionChildren}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className={`${isPaddingBottom ? "pb-6" : "pb-0"} `}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;

interface AccordionContentsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export const AccordionContents = ({
  title,
  children,
  className,
}: AccordionContentsProps) => {
  return (
    <div className={cn("flex flex-col gap-4 px-6", className)}>
      {title ? <span className="font-semibold">{title}</span> : null}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};
