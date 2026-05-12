import Button from "@/components/common/button";
import CheckDialog from "@/components/common/check-dialog";
import CheckFormItem from "@/components/common/form-input/check-field";
import FileFormItem, {
  ImageFormItem,
} from "@/components/common/form-input/file-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTimer } from "@/hooks/timer";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { objectToFormData } from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcwIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { dialogText } from "../../../../../public/text";
import { Languages } from "@/types/common/term";

export const COMPLAIN_TEXT = {
  한국어: {
    name: "성함",
    namePlaceholder: "성함을 입력해주세요",
    replyYn: "회신여부",
    replyDesc: "전화번호를 입력하시면 처리내용을 회신받을 수 있습니다.",
    // phone: "전화번호",
    // phonePlaceholder: "전화번호를 입력해주세요",
    // [변경] phone → receiver 관련 텍스트
    receiver: "연락처",
    methodKakao: "전화번호",
    methodEmail: "이메일",
    receiverPlaceholderKakao: "010XXXXXXXX (숫자만)",
    receiverPlaceholderEmail: "이메일을 입력해주세요",
    title: "제목",
    titlePlaceholder: "제목을 입력해주세요",
    content: "내용",
    contentPlaceholder: "내용을 입력해주세요",
    image: "이미지",
    send: "전송",
    confirm: "확인",
    submit: "접수",
    verified: "인증되었습니다.",
    remaining: "남은횟수",
    codeInput: "인증번호",

    resultSuccess: "접수 완료",
    resultFailed: "접수 실패",
    resultConfirm: "확인",
    resultSubBtn: "목록으로 이동하기",
    errors: {
      createUser: "이름을 입력해주세요.",
      receiverKakaoEmpty: "전화번호를 입력해주세요.",
      receiverKakaoInvalid: "올바른 전화번호를 입력해주세요. (010XXXXXXXX)",
      receiverEmailEmpty: "이메일을 입력해주세요.",
      receiverEmailInvalid: "올바른 이메일 형식을 입력해주세요.",
      title: "제목을 입력해주세요.",
      content: "내용을 입력해주세요.",
    },
  },
  English: {
    name: "Name",
    namePlaceholder: "Enter your name",
    replyYn: "Reply Request",
    replyDesc: "Enter your phone number to receive updates on your complaint.",
    // phone: "Phone Number",
    // phonePlaceholder: "010XXXXXXXX (Korean numbers only, no dashes)",
    // [변경] phone → receiver 관련 텍스트
    receiver: "Contact",
    methodKakao: "Phone(Kakao)",
    methodEmail: "Email",
    receiverPlaceholderKakao: "010XXXXXXXX (Korean numbers only, no dashes)",
    receiverPlaceholderEmail: "Enter your email address",
    title: "Title",
    titlePlaceholder: "Enter a title",
    content: "Content",
    contentPlaceholder: "Enter your complaint details",
    image: "Images",
    send: "Send",
    confirm: "Confirm",
    submit: "Submit",
    verified: "Verified.",
    remaining: "Attempts left",
    codeInput: "Verification Code",
    resultSuccess: "Submission Complete",
    resultFailed: "Submission Failed",
    resultConfirm: "Confirm",
    resultSubBtn: "Go to List",
    errors: {
      createUser: "Please enter your name.",
      receiverKakaoEmpty: "Please enter your phone number.",
      receiverKakaoInvalid: "Please enter a valid phone number. (010XXXXXXXX)",
      receiverEmailEmpty: "Please enter your email address.",
      receiverEmailInvalid: "Please enter a valid email address.",
      title: "Please enter a title.",
      content: "Please enter the content.",
    },
  },
} as const satisfies Record<Languages, object>;

// const formSchema = z
//   .object({
//     vocSeq: z.number("위치를 선택해주세요.").min(1),
//     // vocSeq: z.number("위치를 선택해주세요.").optional(),
//     createUser: z.string().min(1, "이름을 입력해주세요."),
//     // [변경] phone → receiver (전화번호 or 이메일)
//     receiver: z.string().optional(),
//     // [추가] method: kakao | email
//     method: z.enum(["kakao", "email"]).optional(),

//     // [추가] region: ko | en
//     region: z.enum(["ko", "en"]).optional(),

//     serviceTypeSeq: z.number("유형을 선택해주세요."),
//     title: z.string().min(1, "제목을 입력해주세요."),
//     content: z.string().min(1, "내용을 입력해주세요."),
//     //true -> 모바일, false -> 수기
//     division: z.boolean(),
//     replyYn: z.boolean(),
//     images: z.array(z.instanceof(File)),
//   })
//   .superRefine((data, ctx) => {
//     // [변경] replyYn → receiver가 입력된 경우에만 형식 검증
//     if (!data.receiver) return;

//     if (data.method === "kakao") {
//       if (!data.receiver) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "전화번호를 입력해주세요.",
//           path: ["receiver"],
//         });
//       } else if (!/^010\d{8}$/.test(data.receiver.replace(/-/g, ""))) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "올바른 전화번호를 입력해주세요. (010XXXXXXXX)",
//           path: ["receiver"],
//         });
//       }
//     }

//     if (data.method === "email") {
//       if (!data.receiver) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "이메일을 입력해주세요.",
//           path: ["receiver"],
//         });
//       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.receiver)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "올바른 이메일 형식을 입력해주세요.",
//           path: ["receiver"],
//         });
//       }
//     }
//   });

const createFormSchema = (
  errors: (typeof COMPLAIN_TEXT)[Languages]["errors"],
) =>
  z
    .object({
      vocSeq: z.number().min(1),
      createUser: z.string().min(1, errors.createUser), // [변경]
      receiver: z.string().optional(),
      method: z.enum(["kakao", "email"]).optional(),
      region: z.enum(["ko", "en"]).optional(),
      serviceTypeSeq: z.number(),
      title: z.string().min(1, errors.title), // [변경]
      content: z.string().min(1, errors.content), // [변경]
      division: z.boolean(),
      replyYn: z.boolean(),
      images: z.array(z.instanceof(File)),
    })
    .superRefine((data, ctx) => {
      if (!data.receiver) return;

      if (data.method === "kakao") {
        if (!/^010\d{8}$/.test(data.receiver.replace(/-/g, ""))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errors.receiverKakaoInvalid, // [변경]
            path: ["receiver"],
          });
        }
      }

      if (data.method === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.receiver)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errors.receiverEmailInvalid, // [변경]
            path: ["receiver"],
          });
        }
      }
    });

type ComplainAddFormType = z.infer<ReturnType<typeof createFormSchema>>;

// [변경] ContactMethod 타입 kakao | email
export type ContactMethod = "kakao" | "email";

// [추가] language → region 매핑
const LANGUAGE_TO_REGION: Record<Languages, "ko" | "en"> = {
  한국어: "ko",
  English: "en",
};

interface ComplainAddFormProps {
  seq: number;
  language: Languages;
}

const ComplainAddForm = ({ seq, language }: ComplainAddFormProps) => {
  const t = COMPLAIN_TEXT[language];

  const { postAddVoc, postCreateVerificationCode, postValidationCode } =
    useVocStore();
  //회신 인증관련
  // [추가] 체크 의사 표시용 로컬 state (폼의 replyYn과 별개)
  const [wantsReply, setWantsReply] = useState<boolean>(false);
  const [contactMethod, setContactMethod] = useState<ContactMethod>("kakao");
  const [verification, setVerification] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [tryCount, setTryCount] = useState<number>(3);
  const [code, setCode] = useState<string>("");
  //민원 접수 결과
  const [result, setResult] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [createCode, setCreateCode] = useState<string | null>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExpire = useCallback(() => {
    toast.error("입력시간이 초과되었습니다.");
    setVerification(false);
    setTryCount(3);
  }, []);
  const { formatTime, start, reset, seconds } = useTimer(180, handleExpire);
  useEffect(() => {
    if (seconds === 0) setDialogOpen(false);
  }, [seconds]);

  // [변경] language 바뀔 때 스키마 재생성
  const formSchema = useMemo(() => createFormSchema(t.errors), [language]);

  const form = useForm<ComplainAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vocSeq: undefined,
      createUser: "",
      receiver: "", // [변경] phone → receiver
      method: "kakao", // [추가]
      region: LANGUAGE_TO_REGION[language], // [추가]
      division: true,
      replyYn: false,
      images: [],
      serviceTypeSeq: 0,
      title: "",
      content: "",
    },
  });

  // [추가] language 변경 시 region 자동 반영
  useEffect(() => {
    form.setValue("region", LANGUAGE_TO_REGION[language]);
  }, [language, form]);

  useEffect(() => {
    if (!seq || !form) return;
    form.reset({
      vocSeq: seq,
      createUser: "",
      receiver: "", // [변경] phone → receiver
      method: "kakao", // [추가]
      region: LANGUAGE_TO_REGION[language], // [추가]
      division: true,
      replyYn: false,
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

  // const handleSendVerification = async () => {
  //   const phone = form.getValues("phone");
  //   const isValid = await form.trigger("phone");

  //   // phone 필드만 validation 체크

  //   if (!isValid || !phone) {
  //     // validation 실패 시 form에 에러 메시지가 자동으로 표시됨
  //     return;
  //   }

  //   await postCreateVerificationCode(seq, phone);
  //   // validation 성공 - 인증번호 전송 로직
  //   setVerification(true);

  //   start();
  // };

  // [변경] handleSendVerification
  const handleSendVerification = async () => {
    form.setValue("method", contactMethod);

    const receiver = form.getValues("receiver");
    const isValid = await form.trigger("receiver");

    if (!isValid || !receiver) return;

    const region = LANGUAGE_TO_REGION[language]; // [추가]

    await postCreateVerificationCode(seq, receiver, contactMethod, region); // [변경]
    setVerification(true);
    start();
  };

  // const handleCheckVerification = async () => {
  //   const phone = form.getValues("phone");
  //   if (!phone) return;

  //   const res = await postValidationCode(code, phone);
  //   setIsSuccess(res);

  //   if (!res) {
  //     setTryCount((prev) => prev - 1);
  //   } else {
  //     stop();
  //     reset();
  //   }

  //   if (tryCount === 0) {
  //     stop();
  //     toast.error("시도횟수를 초과하였습니다. 다시 시도해주세요.");
  //   }
  // };

  // [변경] 인증 완료 시에만 replyYn: true 반영
  const handleCheckVerification = async () => {
    const receiver = form.getValues("receiver");
    if (!receiver) return;

    const res = await postValidationCode(code, receiver);
    setIsSuccess(res);

    if (!res) {
      setTryCount((prev) => prev - 1);
      if (tryCount - 1 === 0) {
        toast.error("시도횟수를 초과하였습니다. 다시 시도해주세요.");
      }
    } else {
      form.setValue("method", contactMethod);
      form.setValue("replyYn", true); // [추가] 인증 완료 시에만 true
      reset();
    }
  };

  // [추가] 인증방식 변경 시 관련 상태 초기화
  const handleMethodChange = (method: ContactMethod) => {
    setContactMethod(method);
    setVerification(false);
    setIsSuccess(false);
    setTryCount(3);
    reset();
    form.resetField("receiver");
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
                  label={t.name}
                  placeholder={t.namePlaceholder}
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
                  label={t.replyYn}
                  placeholder={t.replyDesc}
                  checked={wantsReply} // [변경] field.value → wantsReply
                  onChange={(val) => {
                    setWantsReply(val.target.checked); // [변경] 로컬 state만 변경
                    // field.onChange는 건드리지 않음 — 인증 완료 시에만 true로
                    if (!val) {
                      // 체크 해제 시 초기화
                      setIsSuccess(false);
                      setVerification(false);
                      setTryCount(3);
                      setCode("");
                      reset();
                      form.resetField("receiver");
                      form.resetField("method");
                      field.onChange(false); // 폼도 false로
                    }
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isSuccess}
                />
              )}
            />

            {!isSuccess ? (
              wantsReply ? (
                <div className="flex flex-col gap-6">
                  {/* [추가] 인증방식 선택 탭 */}
                  <div className="flex items-center bg-gray-100 dark:bg-zinc-700 rounded-lg p-0.5 w-fit">
                    {(["kakao", "email"] as ContactMethod[]).map((method) => (
                      <div
                        key={method}
                        onClick={() => handleMethodChange(method)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all
                          ${
                            contactMethod === method
                              ? "bg-white dark:bg-zinc-950 text-[#1a2340] dark:text-white shadow-sm font-semibold"
                              : "text-gray-400 dark:text-zinc-500"
                          }`}
                      >
                        {method === "kakao" ? t.methodKakao : t.methodEmail}
                      </div>
                    ))}
                  </div>
                  {/* [변경] phone → receiver, placeholder는 method에 따라 분기 */}
                  <FormField
                    control={form.control}
                    name="receiver"
                    render={({ field }) => (
                      <TextFormItem
                        label={
                          contactMethod === "kakao"
                            ? t.methodKakao
                            : t.methodEmail
                        }
                        placeholder={
                          contactMethod === "kakao"
                            ? t.receiverPlaceholderKakao
                            : t.receiverPlaceholderEmail
                        }
                        {...field}
                        required
                      />
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <TextFormItem
                        // label="전화번호"
                        // placeholder="전화번호"
                        label={t.phone}
                        placeholder={t.phonePlaceholder}
                        {...field}
                        required
                      />
                    )}
                  /> */}

                  {verification ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-500 font-mono">
                          {formatTime()}
                        </span>
                        <span className="text-sm text-[var(--description-light)]">
                          {t.remaining} : {tryCount}
                        </span>
                        <CheckDialog
                          title={dialogText.codeRetry.title}
                          description={dialogText.codeRetry.description}
                          actionLabel={dialogText.codeRetry.actionLabel}
                          onClick={handleSendVerification}
                          buttonColor="bg-primary"
                          open={dialogOpen}
                          onOpenChange={setDialogOpen}
                        >
                          <IconButton icon="RotateCcw" />
                        </CheckDialog>
                      </div>

                      <div className="flex gap-6">
                        <Input
                          className="w-full"
                          type="text"
                          placeholder={t.codeInput}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                          label={t.confirm}
                          size={"sm"}
                          type="button"
                          onClick={handleCheckVerification}
                        />
                      </div>
                    </div>
                  ) : form.watch("receiver") ? ( // [변경] phone → receiver
                    <Button
                      label={t.send}
                      onClick={handleSendVerification}
                      type="button"
                    />
                  ) : (
                    <Button
                      label={t.send}
                      variant={"disabled"}
                      disabled={true}
                    />
                  )}
                </div>
              ) : null
            ) : (
              <span className="text-xs text-blue-500">{t.verified}</span>
            )}

            {/* {verification ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-500 font-mono">
                          {formatTime()}
                        </span>
                        <span className="text-sm text-[var(--description-light)]">
                          {t.remaining} : {tryCount}
                        </span>
                        <CheckDialog
                          title={dialogText.codeRetry.title}
                          description={dialogText.codeRetry.description}
                          actionLabel={dialogText.codeRetry.actionLabel}
                          onClick={handleSendVerification}
                          buttonColor="bg-blue-500"
                          open={dialogOpen}
                          onOpenChange={setDialogOpen}
                        >
                          <IconButton icon="RotateCcw" />
                        </CheckDialog>
                      </div>

                      <div className="flex gap-6">
                        <Input
                          className="w-full"
                          type="text"
                          placeholder={t.codeInput}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                          
                          label={t.confirm}
                          size={"sm"}
                          type="button"
                          onClick={handleCheckVerification}
                        />
                      </div>
                    </div>
                  ) : form.watch("phone") ? (
                    <Button
                      // label="전송"
                      label={t.submit}
                      onClick={handleSendVerification}
                      type="button"
                    />
                  ) : (
                    <Button
                      label={t.submit}
                      variant={"disabled"}
                      disabled={true}
                    />
                  )}
                </div>
              ) : null
            ) : (
              <span className="text-xs text-blue-500">{t.verified}</span>
            )} */}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <TextFormItem
                  // label="제목"
                  // placeholder="제목"
                  label={t.title}
                  placeholder={t.titlePlaceholder}
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
                  // label="내용"
                  // placeholder="내용"
                  label={t.content}
                  placeholder={t.contentPlaceholder}
                  {...field}
                  required
                />
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <ImageFormItem
                  // label="이미지"
                  label={t.image}
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  multiple
                  max={5}
                />
              )}
            />
          </div>

          <div className="shrink-0 px-6">
            <Button
              // label="접수"
              label={t.submit}
            />
          </div>
        </form>
      </Form>
      <ResultDialog
        result={result}
        setOpen={setOpen}
        open={open}
        // successUrl={`/complain/${createCode}`}
        successUrl={`/complain/${createCode}?lang=${language === "한국어" ? "ko" : "eng"}`}
        failedUrl={`/complain/add?vocSeq=${seq}`}
        successTitle={t.resultSuccess} // [추가]
        failedTitle={t.resultFailed} // [추가]
        confirmLabel={t.resultConfirm} // [추가]
        subBtnLabel={t.resultSubBtn} // [추가]
      />
    </>
  );
};

export default ComplainAddForm;
