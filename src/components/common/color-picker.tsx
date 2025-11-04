import { SelectOption } from "@/types/common/select-item";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const colors = [
  "d32f2f",
  "e64a19",
  "f57c00",
  "f9a825",
  "fbc02d",
  "c0ca33",
  "388e3c",
  "2e7d32",
  "00897b",
  "00acc1",
  "039be5",
  "1976d2",
  "3949ab",
  "5e35b1",
  "8e24aa",
  "d81b60",
  "ad1457",
  "6d4c41",
  "546e7a",
];

const scheduleColors: SelectOption[] = [
  {
    key: "Red",
    value: "d32f2f",
  },
  {
    key: "Deep Orange",
    value: "e64a19",
  },
  {
    key: "Orange",
    value: "f57c00",
  },
  {
    key: "Amber",
    value: "f9a825",
  },
  {
    key: "Yellow",
    value: "fbc02d",
  },
  {
    key: "Lime",
    value: "c0ca33",
  },
  {
    key: "Green",
    value: "388e3c",
  },
  {
    key: "Dark Green",
    value: "2e7d32",
  },
  {
    key: "Teal",
    value: "00897b",
  },
  {
    key: "Cyan",
    value: "00acc1",
  },
  {
    key: "Light Blue",
    value: "039be5",
  },
  {
    key: "Blue",
    value: "1976d2",
  },
  {
    key: "Indigo",
    value: "3949ab",
  },
  {
    key: "Deep Purple",
    value: "5e35b1",
  },
  {
    key: "Purple",
    value: "8e24aa",
  },
  {
    key: "Pink",
    value: "d81b60",
  },
  {
    key: "Magenta",
    value: "ad1457",
  },
  {
    key: "Brown",
    value: "6d4c41",
  },
  {
    key: "Blue Grey",
    value: "546e7a",
  },
];

interface ColorPickerProps {
  value?: string | null;
  onChange: (color: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  useEffect(() => {
    if (!value) {
      onChange("d32f2f");
    }
  }, [value]);
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(value) => onChange(value)}
    >
      <SelectTrigger
        className={`w-fit text-sm  rounded-[4px] border border-[var(--border)] shadow-none transition duration-300
                          focus-visible:border-[var(--primary)] focus-visible:border-1 focus-visible:ring-1 focus-visible:ring-[var(--primary)]
                          hover:border-[var(--primary)] hover:cursor-pointer
                          data-[placeholder]:text-[var(--placeholder)] data-[state=open]:ring-[var(--primary)] data-[state=open]:border-[var(--primary)] data-[state=open]:ring-1 data-[state=open]:ring-inset
                          `}
      >
        <SelectValue placeholder={"색상을 선택해주세요."} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <div className="grid grid-cols-2">
          {scheduleColors.map((v, i) => (
            <SelectItem
              key={i}
              value={v.value.toString()}
              className="cursor-pointer"
            >
              <ColorItem color={v.value.toString()} />
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};

export default ColorPicker;

const ColorItem = ({ color }: { color: string }) => {
  return (
    <div
      style={{ backgroundColor: `#${color}` }}
      className={`rounded-full w-4 h-4`}
    />
  );
};
