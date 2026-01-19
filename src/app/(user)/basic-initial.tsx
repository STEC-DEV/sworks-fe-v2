"use client";
import { useBasicStore } from "@/store/basic-store";
import React, { useEffect } from "react";

const BasicInitial = () => {
  const { getBasicCode } = useBasicStore();
  useEffect(() => {
    getBasicCode();
  }, [getBasicCode]);
  return <div></div>;
};

export default BasicInitial;
