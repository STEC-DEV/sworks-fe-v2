import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useDecodeParam = (paramsName: string) => {
  const params = useParams();
  const param = params[paramsName];

  const decodeValue = useMemo(() => {
    if (!param) return "";
    return decodeURIComponent(param.toString().toUpperCase());
  }, [param]);

  const rawValue = param?.toString() ?? "";

  return { decodeValue, rawValue };
};
