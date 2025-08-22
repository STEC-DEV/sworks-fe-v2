import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useDecodeParam = (paramsName: string) => {
  const [decodeValue, setDecodeValue] = useState<string>("");
  const [rawValue, setRawValue] = useState<string>("");
  const params = useParams();

  useEffect(() => {
    const param = params[paramsName];

    //복호화
    if (!param) return;
    setDecodeValue(decodeURIComponent(param?.toString().toUpperCase()));
    setRawValue(param.toString());
  }, [params, paramsName]);

  return { decodeValue, rawValue };
};
