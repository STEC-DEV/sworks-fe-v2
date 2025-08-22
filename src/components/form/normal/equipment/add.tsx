import { DateFormItem } from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem from "@/components/common/form-input/select-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { FormField } from "@/components/ui/form";
import { useBasicStore } from "@/store/basic-store";
import { convertSelectOptionType } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  serviceTypeSeq: z.number().min(1, "업무 유형을 선택해주세요."),

  serial: z.string().min(1, "관리번호를 입력해주세요."),

  name: z.string().min(1, "장비명을 입력해주세요."),

  capacity: z.string().min(1, "규격용량을 입력해주세요."),

  usage: z.string().min(1, "용도를 입력해주세요."),

  maker: z.string().min(1, "구매처를 입력해주세요."),

  buyer: z.string().min(1, "구매자를 입력해주세요."),

  amount: z.string().min(1, "수량을 입력해주세요."),

  cost: z.string(),

  buyDt: z.date(),

  manager: z.string().min(1, "관리 부서를 입력해주세요."),
  images: z.array(z.instanceof(File)),
});

export type BasicFormType = z.infer<typeof formSchema>;

interface EquipmentAddFormProps {
  onNext: (values: BasicFormType) => void;
}

const EquipmentAddForm = ({ onNext }: EquipmentAddFormProps) => {
  const { basicCode } = useBasicStore();

  const form = useForm<BasicFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceTypeSeq: undefined,
      serial: "",
      name: "",
      capacity: "",
      usage: "",
      maker: "",
      buyer: "",
      amount: "1",
      cost: "0",
      buyDt: new Date(),
      manager: "",
      images: [],
    },
  });

  return (
    <CommonFormContainer
      title="기본정보"
      form={form}
      nextLabel="생성"
      onNext={onNext}
    >
      <div className="grid grid-cols-2 gap-x-24 gap-y-12">
        {basicCode.contractCodes ? (
          <FormField
            control={form.control}
            name="serviceTypeSeq"
            render={({ field }) => {
              const handleValue = (value: string) => {
                field.onChange(Number(value));
              };
              return (
                <SelectFormItem
                  label="유형"
                  selectItem={convertSelectOptionType(
                    basicCode.contractCodes ?? []
                  )}
                  onValueChange={handleValue}
                  defaultValue={field.value?.toString()}
                  required
                />
              );
            }}
          />
        ) : null}
        <FormField
          control={form.control}
          name="serial"
          render={({ field }) => (
            <TextFormItem
              label="관리번호"
              placeholder="관리번호"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TextFormItem
              label="장비명"
              placeholder="장비명"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <TextFormItem
              label="규격용량"
              placeholder="규격용량"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="usage"
          render={({ field }) => (
            <TextFormItem label="용도" placeholder="용도" {...field} required />
          )}
        />
        <FormField
          control={form.control}
          name="maker"
          render={({ field }) => (
            <TextFormItem
              label="구매처"
              placeholder="구매처"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="buyer"
          render={({ field }) => (
            <TextFormItem
              label="구매자"
              placeholder="구매자"
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <TextFormItem
              label="수량"
              placeholder="수량"
              type="number"
              min={1}
              {...field}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <TextFormItem
              label="비용"
              placeholder="비용"
              type="number"
              min={0}
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="buyDt"
          render={({ field }) => (
            <DateFormItem
              label="구매일"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              required
            />
          )}
        />
        <FormField
          control={form.control}
          name="manager"
          render={({ field }) => (
            <TextFormItem
              label="관리부서"
              placeholder="관리부서"
              {...field}
              required
            />
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FileFormItem
            label="첨부파일"
            accept="accept"
            multiple={false}
            {...field}
            value={field.value}
            onChange={field.onChange}
            imageOnly
          />
        )}
      />
    </CommonFormContainer>
  );
};

export default EquipmentAddForm;
