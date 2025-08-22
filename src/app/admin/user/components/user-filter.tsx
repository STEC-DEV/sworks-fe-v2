"use client";
import CommonFilter, {
  FilterConfig,
} from "@/components/ui/custom/filter.tsx/common-filter";
import { useDeptStore } from "@/store/admin/dept/dept-store";
import { useBasicStore } from "@/store/basic-store";

import { convertSelectOptionType } from "@/utils/convert";
import { convertKeyValueArrayToRecord } from "@/utils/convert";
import { BriefcaseBusiness } from "lucide-react";
import React, { useEffect, useState } from "react";

const AdminFilter = () => {
  const { departmentList, getDepartmentList } = useDeptStore();
  const { basicCode } = useBasicStore();
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([
    {
      key: "deptSeq",
      placeholder: "부서",
      data: {},
      icon: BriefcaseBusiness,
    },
    {
      key: "role",
      placeholder: "권한",
      data: {},
      icon: BriefcaseBusiness,
    },
  ]);

  useEffect(() => {
    getDepartmentList();
  }, []);

  useEffect(() => {
    handleConvertDeptData();
  }, [departmentList]);

  useEffect(() => {
    handleConvertRoleData();
  }, [basicCode]);

  const handleConvertDeptData = async () => {
    if (!departmentList) return;
    const data = await convertSelectOptionType(departmentList);
    const convertData = await convertKeyValueArrayToRecord(data);
    console.log(convertData);
    setFilterConfig((prev) =>
      prev.map((item) =>
        item.key === "deptSeq" ? { ...item, data: convertData } : item
      )
    );
  };

  const handleConvertRoleData = async () => {
    if (!basicCode.managerCodes) return;
    const data = convertSelectOptionType(basicCode.managerCodes);
    const convertData = convertKeyValueArrayToRecord(data);

    setFilterConfig((prev) =>
      prev.map((item) =>
        item.key === "role" ? { ...item, data: convertData } : item
      )
    );
  };

  return <CommonFilter filters={filterConfig} />;
};

export default AdminFilter;
