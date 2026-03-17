export const OptionSectionWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col gap-4 xl:flex-row">{children}</div>;
};
