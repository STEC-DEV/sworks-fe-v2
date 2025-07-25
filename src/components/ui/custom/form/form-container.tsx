import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import Button from "@/components/common/button";
import { Form } from "../../form";

interface CommonFormContainerProps<T extends FieldValues> {
  title: string;
  form: UseFormReturn<T>;
  nextLabel: string;
  onNext: () => void;
  onPrev?: () => void;
  children: React.ReactNode;
}

const CommonFormContainer = <T extends FieldValues>({
  title,
  form,
  nextLabel,
  onNext,
  onPrev,
  children,
}: CommonFormContainerProps<T>) => {
  return (
    <Form {...form}>
      <div className="py-4 border-b border-[var(--border)]">
        <span className="text-md font-semibold">{title}</span>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onNext)}
      >
        {children}
        <div className={`flex ${onPrev ? "justify-between" : "justify-end"} `}>
          {onPrev ? (
            <Button
              label="이전"
              variant={"prev"}
              size={"sm"}
              onClick={onPrev}
            />
          ) : null}

          <Button label={nextLabel} size={"sm"} onClick={() => onNext()} />
        </div>
      </form>
    </Form>
  );
};

export default CommonFormContainer;
