"use client";

import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import AppTitle from "@/components/common/label/title";
import { Form } from "@/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";

/* ─────────────────────────────────────────
   CommonFormContainer — 카드형
───────────────────────────────────────── */
interface CommonFormContainerProps<T extends FieldValues> {
  title?: string;
  prevPath?: string;
  form: UseFormReturn<T>;
  nextLabel?: string;
  prevLabel?: string;
  onNext: (value: T) => void;
  onPrev?: () => void;
  children: React.ReactNode; // 카드들을 직접 받음
}

export const CommonFormContainer = <T extends FieldValues>({
  title,
  prevPath,
  form,
  nextLabel = "다음",
  prevLabel = "이전",
  onNext,
  onPrev,
  children,
}: CommonFormContainerProps<T>) => {
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(
          (value) => onNext(value),
          (err) => console.log(err),
        )}
      >
        {title && (
          <AppTitle
            title={title}
            isPrev={prevPath ? true : false}
            prevPath={prevPath}
          />
        )}

        {/* 카드들 */}
        {children}

        {/* 하단 버튼 */}
        <div className={`flex ${onPrev ? "justify-between" : "justify-end"}`}>
          {onPrev && (
            <Button
              label={prevLabel}
              type="button"
              variant="prev"
              size="sm"
              onClick={onPrev}
            />
          )}
          <Button type="submit" label={nextLabel} size="sm" />
        </div>
      </form>
    </Form>
  );
};

/* ─────────────────────────────────────────
   FormCard — 섹션별 카드 래퍼
───────────────────────────────────────── */
interface FormCardProps {
  title: string;
  children: React.ReactNode;
  titleOptionChildren?: React.ReactNode;
}

export const FormCard = ({
  title,
  children,
  titleOptionChildren,
}: FormCardProps) => {
  return (
    <CustomCard className="gap-0 py-0 divide-y divide-border">
      <div className="flex items-center justify-between px-4 py-3 bg-background">
        <span className="text-sm font-bold text-description">{title}</span>
        {titleOptionChildren}
      </div>
      <div className="p-6 flex flex-col gap-4">{children}</div>
    </CustomCard>
  );
};
