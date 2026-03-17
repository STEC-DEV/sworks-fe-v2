import { useEffect, useState } from "react";
import CustomCard from "./card";
import { X } from "lucide-react";

interface ReportModalProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const ReportModal = ({
  trigger,
  children,

  open: controlledOpen,
  onOpenChange,
}: ReportModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // controlled vs uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // 약간의 지연 후 애니메이션 시작
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      document.body.style.overflow = "unset";
      setIsAnimating(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      if (isControlled) {
        onOpenChange?.(false);
      } else {
        setInternalOpen(false);
      }
    }, 200);
  };

  const handleOpen = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <>
      {/* 트리거 */}
      <div onClick={handleOpen}>{trigger}</div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-200 ${
              isAnimating ? "opacity-50" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* Modal Content */}
          <div
            className={`relative z-10 xl:w-[60vw] px-4 transition-all duration-200 ${
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <CustomCard className="pb-0">
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 border-b pt-0">
                <h2 className="text-xl font-semibold">리포트</h2>
                <button
                  onClick={handleClose}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">닫기</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 pb-0 overflow-y-auto max-h-[calc(70vh-80px)]">
                {children}
              </div>
            </CustomCard>
          </div>
        </div>
      )}
    </>
  );
};
