import { cva } from "class-variance-authority";
import React from "react";

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Button = () => {
  return <button />;
};

export default Button;
