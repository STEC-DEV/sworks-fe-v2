import Button from "@/components/common/button";
import CheckFormItem from "@/components/common/form-input/check-field";
import FileFormItem from "@/components/common/form-input/file-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import Input from "@/components/common/input";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTimer } from "@/hooks/timer";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { objectToFormData } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  vocSeq: z.number("위치를 선택해주세요.").min(1),
  // vocSeq: z.number("위치를 선택해주세요.").optional(),
  createUser: z.string().min(1, "이름을 입력해주세요."),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^010\d{8}$/.test(val.replace(/-/g, "")), {
      message: "올바른 전화번호를 입력해주세요 (010-XXXX-XXXX)",
    }),
  serviceTypeSeq: z.number("유형을 선택해주세요."),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  //true -> 모바일, false -> 수기
  division: z.boolean(),
  replyYn: z.boolean(),
  images: z.array(z.instanceof(File)),
});

type ComplainAddFormType = z.infer<typeof formSchema>;

interface ComplainAddFormProps {
  seq: number;
}

const ComplainAddForm = ({ seq }: ComplainAddFormProps) => {
  const { postAddVoc, postCreateVerificationCode, postValidationCode } =
    useVocStore();
  const [verification, setVerification] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [tryCount, setTryCount] = useState<number>(3);
  const [code, setCode] = useState<string>("");
  //민원 접수 결과
  const [result, setResult] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [createCode, setCreateCode] = useState<string | null>();

  const handleExpire = useCallback(() => {
    toast.error("입력시간이 초과되었습니다.");
    setVerification(false);
    setTryCount(3);
  }, []);
  const { formatTime, start, reset } = useTimer(180, handleExpire);

  const form = useForm<ComplainAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vocSeq: undefined,
      createUser: "",
      phone: "",
      division: true, // 추가
      replyYn: false, // 추가
      images: [],
      serviceTypeSeq: 0,
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!seq || !form) return;

    form.reset({
      vocSeq: seq,
      createUser: "",
      phone: "",
      division: true, // 추가
      replyYn: false, // 추가
      images: [],
      serviceTypeSeq: 0,
      title: "",
      content: "",
    });
  }, [form, seq]);

  const handleSubmit = async (values: ComplainAddFormType) => {
    const formData = objectToFormData(values);
    const res = await postAddVoc(formData);
    res === null ? setResult(false) : setResult(true);
    setCreateCode(res);
    setOpen(true);
  };

  const handleSendVerification = async () => {
    const phone = form.getValues("phone");
    const isValid = await form.trigger("phone");

    // phone 필드만 validation 체크

    if (!isValid || !phone) {
      // validation 실패 시 form에 에러 메시지가 자동으로 표시됨
      return;
    }

    await postCreateVerificationCode(seq, phone);
    // validation 성공 - 인증번호 전송 로직
    setVerification(true);

    start();
  };

  const handleCheckVerification = async () => {
    const phone = form.getValues("phone");
    if (!phone) return;

    const res = await postValidationCode(code, phone);
    setIsSuccess(res);

    if (!res) {
      setTryCount((prev) => prev - 1);
    } else {
      stop();
      reset();
    }

    if (tryCount === 0) {
      stop();
      toast.error("시도횟수를 초과하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 flex flex-col gap-6 "
        >
          <div className="flex-1 flex flex-col gap-6 px-6">
            <FormField
              control={form.control}
              name="createUser"
              render={({ field }) => (
                <TextFormItem
                  label="성함"
                  placeholder="성함"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="replyYn"
              render={({ field }) => (
                <CheckFormItem
                  label="회신여부"
                  description="전화번호를 입력하시면 처리내용을 회신받을 수 있습니다."
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isSuccess}
                />
              )}
            />

            {!isSuccess ? (
              form.watch("replyYn") ? (
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <TextFormItem
                        label="전화번호"
                        placeholder="전화번호"
                        {...field}
                        required
                      />
                    )}
                  />

                  {verification ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-[var(--description-light)]">
                        {formatTime()}
                      </span>
                      <span className="text-sm text-[var(--description-light)]">
                        남은횟수 : {tryCount}
                      </span>
                      <div className="flex gap-6">
                        <Input
                          className="w-full"
                          type="text"
                          placeholder="인증번호"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                          label="확인"
                          size={"sm"}
                          type="button"
                          onClick={handleCheckVerification}
                        />
                      </div>
                    </div>
                  ) : form.watch("phone") ? (
                    <Button
                      label="전송"
                      onClick={handleSendVerification}
                      type="button"
                    />
                  ) : (
                    <Button label="전송" variant={"disabled"} disabled={true} />
                  )}
                </div>
              ) : null
            ) : (
              <span className="text-xs text-blue-500">인증되었습니다.</span>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <TextFormItem
                  label="제목"
                  placeholder="제목"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <TextAreaFormItem
                  label="내용"
                  placeholder="내용"
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FileFormItem
                  label="첨부파일"
                  accept="accept"
                  multiple={true}
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  imageOnly
                  isVertical
                />
              )}
            />
          </div>

          <div className="shrink-0 px-6">
            <Button label="접수" />
          </div>
        </form>
      </Form>
      <ResultDialog
        result={result}
        setOpen={setOpen}
        open={open}
        successUrl={`/complain/${createCode}`}
        failedUrl={`/complain/add?vocSeq=${seq}`}
      />
    </>
  );
};

export default ComplainAddForm;
