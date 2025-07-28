"use client";
import { useBasicStore } from "@/store/basic-store";
import React, { useEffect } from "react";

const BasicInitial = () => {
  const { basicCode, getBasicCode } = useBasicStore();
  useEffect(() => {
    getBasicCode();
  }, []);

  return null;
};

export default BasicInitial;
