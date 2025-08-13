"use client";
import {
  ChecklistDivType,
  ChecklistMultiType,
} from "@/types/admin/workplace/chk-types";

import { useEffect, useState } from "react";

export const useCheckMultiTypeSelect = (
  data: ChecklistMultiType[],
  formValues: { serviceSeq?: number; divCodeSeq?: number }
) => {
  const [selectedService, setSelectedService] = useState<
    ChecklistMultiType | undefined
  >(undefined);
  const [selectedDiv, setSelectedDiv] = useState<ChecklistDivType | undefined>(
    undefined
  );

  useEffect(() => {
    if (formValues.serviceSeq && data) {
      const service = data.find(
        (s) => s.serviceTypeSeq === formValues.serviceSeq
      );
      if (service) {
        setSelectedService(service);
        if (formValues.divCodeSeq) {
          const div = service.divs?.find(
            (d) => d.divCodeSeq === formValues.divCodeSeq
          );
          if (div) setSelectedDiv(div);
        } else {
          setSelectedDiv(undefined);
        }
      }
    }
  }, [formValues.serviceSeq, formValues.divCodeSeq, data]);

  //Service 선택 step 1
  const handleServiceSelect = (service: ChecklistMultiType) => {
    setSelectedService(service);
    //계약유형 선택 시 하위 선택 모두 초기화
    setSelectedDiv(undefined);
  };

  //Div 선택 step 1
  const handleDivSelect = (div: ChecklistDivType) => {
    setSelectedDiv(div);
  };

  return { selectedDiv, selectedService, handleServiceSelect, handleDivSelect };
};
