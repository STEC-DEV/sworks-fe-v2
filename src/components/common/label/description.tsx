import React from "react";

const Description = ({ desc }: { desc: string }) => {
  return <span className="text-xs text-[var(--description-dark)]">{desc}</span>;
};

export default Description;
