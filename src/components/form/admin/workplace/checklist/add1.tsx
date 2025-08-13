import SelectFormItem from "@/components/common/form-input/select-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useCheckMultiTypeSelect } from "@/hooks/select/casecading-select";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import {
  DivCodeType,
  ServiceType,
  TypeCodeType,
} from "@/types/common/basic-code";
import { convertSelectOptionType } from "@/types/common/select-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z
  .object({
    serviceTypeSeq: z.number().optional(),
    divCodeSeq: z.number().optional(),
    typeCodeSeq: z.number().optional(),
  })
  .refine(
    (data) => {
      return data.serviceTypeSeq !== undefined;
    },
    { message: "항목을 선택해주세요", path: ["serviceSeq"] }
  )
  .refine(
    (data) => {
      return data.divCodeSeq !== undefined;
    },
    { message: "항목을 선택해주세요", path: ["divCodeSeq"] }
  )
  .refine(
    (data) => {
      return data.typeCodeSeq !== undefined;
    },
    { message: "항목을 선택해주세요", path: ["typeCodeSeq"] }
  );

export type TypeAddFormType = z.infer<typeof formSchema>;

interface ChecklistTypeAddFormProps {
  onPrev?: () => void;
  onNext: (values: TypeAddFormType) => void;
}

const ChecklistTypeAddForm = ({
  onPrev,
  onNext,
}: ChecklistTypeAddFormProps) => {
  const { checklistMultiType, getCheckMultiType } = useWorkplaceDetailStore();
  const { id } = useParams();
  const { createChecklist } = useWorkplaceDetailStore();
  const form = useForm<TypeAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceTypeSeq: createChecklist.serviceTypeSeq,
      divCodeSeq: createChecklist.divCodeSeq,
      typeCodeSeq: createChecklist.typeCodeSeq,
    },
  });

  //계약유형, 관리부문, 관리유형 커스텀훅
  const formValues = form.watch(["serviceTypeSeq", "divCodeSeq"]);
  const { selectedService, selectedDiv, handleServiceSelect, handleDivSelect } =
    useCheckMultiTypeSelect(checklistMultiType ?? [], {
      serviceSeq: formValues[0],
      divCodeSeq: formValues[1],
    });

  useEffect(() => {
    if (!id) return;
    getCheckMultiType(id?.toString());
  }, []);

  return (
    <CommonFormContainer
      title="기본정보"
      form={form}
      nextLabel="다음"
      onNext={onNext}
      onPrev={onPrev}
    >
      {checklistMultiType ? (
        <>
          <FormField
            control={form.control}
            name="serviceTypeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                const serviceType = checklistMultiType.find(
                  (t) => t.serviceTypeSeq === parseInt(value)
                );
                if (serviceType) handleServiceSelect(serviceType);

                field.onChange(Number(value));
                form.setValue("divCodeSeq", undefined);
                form.setValue("typeCodeSeq", undefined);
              };
              return (
                <SelectFormItem
                  label="계약유형"
                  selectItem={convertSelectOptionType(
                    checklistMultiType as ServiceType[]
                  )}
                  onValueChange={handleValue}
                  defaultValue={field.value?.toString()}
                  required
                />
              );
            }}
          />

          {selectedService ? (
            <FormField
              control={form.control}
              name="divCodeSeq"
              render={({ field }) => {
                const handleValue = (value: string) => {
                  const divType = selectedService.divs.find(
                    (t) => t.divCodeSeq === parseInt(value)
                  );
                  if (divType) handleDivSelect(divType);
                  field.onChange(Number(value));

                  form.setValue("typeCodeSeq", undefined);
                };
                // watch로 실시간 값 감지
                const currentDivValue = form.watch("divCodeSeq");
                return (
                  <SelectFormItem
                    key={`type-${selectedDiv?.divCodeSeq}-${
                      field.value || "empty"
                    }`}
                    label="관리부문"
                    selectItem={convertSelectOptionType(
                      (selectedService?.divs as DivCodeType[]) ?? []
                    )}
                    onValueChange={handleValue}
                    defaultValue={currentDivValue?.toString() || ""}
                    required
                  />
                );
              }}
            />
          ) : null}
          {selectedDiv ? (
            <FormField
              control={form.control}
              name="typeCodeSeq"
              render={({ field }) => {
                const handleValue = (value: string) => {
                  field.onChange(Number(value));
                };

                // watch로 실시간 값 감지
                const currentTypeValue = form.watch("typeCodeSeq");
                return (
                  <SelectFormItem
                    key={`type-${selectedDiv?.divCodeSeq || "none"}`}
                    label="관리유형"
                    selectItem={convertSelectOptionType(
                      (selectedDiv?.types as TypeCodeType[]) ?? []
                    )}
                    onValueChange={handleValue}
                    defaultValue={currentTypeValue?.toString()}
                    required
                  />
                );
              }}
            />
          ) : null}
        </>
      ) : null}
    </CommonFormContainer>
  );
};

export default ChecklistTypeAddForm;
