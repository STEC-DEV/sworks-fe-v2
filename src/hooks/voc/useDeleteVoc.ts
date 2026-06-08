import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const useDeleteVoc = () => {
  const queryClient = useQueryClient();
  const router = useRouter(); // next.js

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (delSeq: number | number[]) => {
      const seqArray = Array.isArray(delSeq) ? delSeq : [delSeq];
      return api
        .delete(`Voc/W/sign/DeleteVocLog`, {
          searchParams: seqArray.map((seq) => ["delSeq", seq]),
        })
        .json<Response<boolean>>();
    },
    onSuccess: () => {
      router.push("/voc");
    },
    onError: (error) => {
      console.error("삭제 실패:", error);
      toast.error("민원 삭제 실패");
      // 토스트 등 에러 처리
    },
  });
  return { mutate: mutate, isPending, isError };
};

export default useDeleteVoc;
