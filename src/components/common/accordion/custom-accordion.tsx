"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { LucideIcon } from "lucide-react";

interface CustomAccordionProps {
  icon?: LucideIcon;
  label: string;
  optionChildren?: React.ReactNode;
  children: React.ReactNode;
}

const CustomAccordion = ({
  icon,
  label,
  children,
  optionChildren,
}: CustomAccordionProps) => {
  const Icon = icon;
  return (
    <Accordion
      type="single"
      collapsible
      className="flex-1 border border-[var(--border)] rounded-[4px] shadow-sm bg-white"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className=" px-4 py-2 hover:no-underline items-center focus-visible:ring-0 focus-visible:outline-none">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
              {Icon ? <Icon className="w-5 h-5 text-blue-500 " /> : null}

              <span className="text-sm font-normal">{label}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>{optionChildren}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
