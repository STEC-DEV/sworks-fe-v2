"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "../ui/form";
import {
  PasswordTextFormItem,
  TextFormItem,
} from "../common/form-input/text-field";
import Button from "../common/button";
import { LoginAction } from "@/app/server-action/auth/auth-action";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth-store";
import zod from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const formSchema = z.object({
  loginId: z.string("사번 입력해주세요.").min(2, "2글자 이상 입력해주세요."),
  loginPassword: z
    .string("비밀번호를 입력해주세요.")
    .min(2, "2글자 이상 입력해주세요."),
});
/**
 * 일반 근무자 계정 555555, stecdev1234!
 * @returns
 */

const LoginForm = () => {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<boolean>(false);
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [loginId, setLoginId] = useState<string>("");
  const {
    getWorkplacePermission,
    getAdminProfile,
    setWorkplaceId,
    getNormalModeProfile,
  } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginId: "",
      loginPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await LoginAction(data, loginMode);
    if (!res.result) {
      toast.error(res.message);
    }

    if (!res.url) return;

    //최초로그인
    if (res.code === 199) {
      setShowPasswordChange(true);
      setLoginId(data.loginId);
      return;
    }

    //관리자 모드
    if (res.code === 100) {
      await getAdminProfile();
    }

    //일반 근무자 로그인 성공 시 사업장 정보 조회
    if (
      res.code === 200 ||
      res.code === 201 ||
      res.code === 202 ||
      res.code === 101
    ) {
      await getWorkplacePermission();
      await getNormalModeProfile();
    }

    router.replace(res.url);
  };

  return (
    <>
      <Form {...form}>
        <div
          className="flex justify-end items-center gap-2"
          onClick={() => {
            setLoginMode(!loginMode);
          }}
        >
          <Switch
            className="ring ring-[var(--border)]  hover:cursor-pointer data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--background)] [&_[data-slot=switch-thumb]]:bg-white focus-visible:ring-0 focus-visible:outline-none"
            checked={loginMode}
            onCheckedChange={(checked) => setLoginMode(checked)}
          />
          <span className="text-xs text-[var(--description-light)]  hover:cursor-pointer">
            관리 모드
          </span>
        </div>
        <form
          // 서버액션
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="loginId"
            render={({ field }) => (
              <TextFormItem label="사번" placeholder="사번" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="loginPassword"
            render={({ field }) => (
              <PasswordTextFormItem
                label="비밀번호"
                placeholder="비밀번호"
                required={false}
                {...field}
              />
            )}
          />
          <Button label="로그인" />
        </form>
      </Form>
      <PasswordChangeDialog
        open={showPasswordChange}
        onOpenChange={setShowPasswordChange}
        loginId={loginId}
      />
    </>
  );
};

export default LoginForm;

const passwordSchema = zod
  .object({
    loginId: z.string(),
    loginPassword: z.string().min(6, "6자 이상입력해주세요."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.loginPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type PasswordFormType = z.infer<typeof passwordSchema>;

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginId: string;
}

const PasswordChangeDialog = ({
  open,
  onOpenChange,
  loginId,
}: PasswordChangeDialogProps) => {
  const { patchPasswordChange } = useAuthStore();
  const form = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
    reValidateMode: "onChange",
    defaultValues: {
      loginId: "",
      loginPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        loginId: loginId,
        loginPassword: "",
        confirmPassword: "",
      });
    }
  }, [open, loginId, form]);

  const handleSubmit = async (values: PasswordFormType) => {
    const { confirmPassword, ...rest } = values;
    const payload = rest;
    await patchPasswordChange(payload);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span>비밀번호 변경</span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-[var(--description-dark)]">
          최초 로그인 시 비밀번호를 변경해야합니다.
        </AlertDialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="loginPassword"
              render={({ field }) => (
                <PasswordTextFormItem
                  label="비밀번호"
                  placeholder="비밀번호"
                  required
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <PasswordTextFormItem
                  label="비밀번호 확인"
                  placeholder="비밀번호 확인"
                  required
                  {...field}
                />
              )}
            />
            <div className="flex gap-6">
              <Button label="변경" />
              <Button
                type="button"
                label="취소"
                variant={"prev"}
                onClick={() => onOpenChange(false)}
              />
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
