import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../alert-dialog";
import LottiePlayer from "@/components/common/lottie-player";
import Success from "../../../../../public/lottie/Success.json";
import Failed from "../../../../../public/lottie/Failed.json";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";

interface ResultDialogProps {
  result: boolean;
  successUrl: string;
  successSubUrl?: string;
  failedUrl: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // [추가] 모두 optional — 기존 사용처 영향 없음
  successTitle?: string;
  failedTitle?: string;
  confirmLabel?: string;
  subBtnLabel?: string;
}

const ResultDialog = ({
  result,
  successUrl,
  successSubUrl,
  failedUrl,
  open,
  setOpen,

  successTitle = "성공", // [추가] 기본값
  failedTitle = "실패", // [추가] 기본값
  confirmLabel = "확인", // [추가] 기본값
  subBtnLabel = "목록으로 이동하기", // [추가] 기본값
}: ResultDialogProps) => {
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent className="gap-12">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {" "}
            {result ? successTitle : failedTitle} {/* [변경] */}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <LottiePlayer lottie={result ? Success : Failed} />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={() => router.replace(result ? successUrl : failedUrl)}
            label={confirmLabel}
          />
          {successSubUrl && result ? (
            <a
              href={successSubUrl}
              className="text-xs text-[var(--description-dark)] underline decoration-[var(--description-dark)]"
            >
              {subBtnLabel}
            </a>
          ) : null}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResultDialog;
