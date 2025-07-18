"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "../ui/form";
import {
  PasswordTextFormItem,
  TextFormItem,
} from "../common/form-input/text-field";

const formSchema = z.object({
  loginId: z
    .string("아이디를 입력해주세요.")
    .min(2, "2글자 이상 입력해주세요."),
  loginPassword: z
    .string("비밀번호를 입력해주세요.")
    .min(2, "2글자 이상 입력해주세요."),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginId: "",
      loginPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="loginId"
          render={({ field }) => (
            <TextFormItem label="아이디" placeholder="아이디" {...field} />
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
      </form>
    </Form>
  );
};

export default LoginForm;
