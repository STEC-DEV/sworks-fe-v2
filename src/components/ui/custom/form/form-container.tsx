import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import Button from "@/components/common/button";
import { Form } from "../../form";

interface CommonFormContainerProps<T extends FieldValues> {
  title: string;
  form: UseFormReturn<T>;
  nextLabel: string;
  onNext: (value: T) => void;
  onPrev?: () => void;
  children: React.ReactNode;
  titleOptionChildren?: React.ReactNode;
}

const CommonFormContainer = <T extends FieldValues, TSubmit>({
  title,
  form,
  nextLabel,
  onNext,
  onPrev,
  children,
  titleOptionChildren,
}: CommonFormContainerProps<T>) => {
  return (
    <Form {...form}>
      <div className="flex items-center justify-between py-4 border-b border-[var(--border)]">
        <span className="text-md font-semibold">{title}</span>
        {titleOptionChildren}
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit((value) => onNext(value))}
      >
        {children}
        <div className={`flex ${onPrev ? "justify-between" : "justify-end"} `}>
          {onPrev ? (
            <Button
              label="이전"
              type="button"
              variant={"prev"}
              size={"sm"}
              onClick={onPrev}
            />
          ) : null}

          <Button type="submit" label={nextLabel} size={"sm"} />
        </div>
      </form>
    </Form>
  );
};

export default CommonFormContainer;
