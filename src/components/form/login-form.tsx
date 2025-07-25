"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "../ui/form";
import {
  PasswordTextFormItem,
  TextFormItem,
} from "../common/form-input/text-field";
import Button from "../common/button";
import {
  adminModeLoginAction,
  normalModeLoginAction,
} from "@/app/server-action/auth/auth-action";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  loginId: z.string("사번 입력해주세요.").min(2, "2글자 이상 입력해주세요."),
  loginPassword: z
    .string("비밀번호를 입력해주세요.")
    .min(2, "2글자 이상 입력해주세요."),
});

const LoginForm = () => {
  const [loginMode, setLoginMode] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginId: "",
      loginPassword: "",
    },
  });

  return (
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
        onSubmit={form.handleSubmit(
          loginMode ? adminModeLoginAction : normalModeLoginAction
        )}
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
              {...field}
            />
          )}
        />
        <Button label="로그인" />
      </form>
    </Form>
  );
};

export default LoginForm;
