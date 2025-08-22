import { useAuthStore } from "@/store/auth/auth-store";
import { useBasicStore } from "@/store/basic-store";
import React, { useEffect } from "react";

const BasicInitial = () => {
  const { basicCode, getBasicCode } = useBasicStore();
  useEffect(() => {
    getBasicCode();
  }, []);
  return <div></div>;
};

export default BasicInitial;
