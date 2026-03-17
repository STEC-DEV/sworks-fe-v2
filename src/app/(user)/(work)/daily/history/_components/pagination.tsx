import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";

import { ReportModal } from "@/components/common/modal";
import ReactMarkdown from "react-markdown";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { fetchDailyReport, REPORT_MOCKUP } from "@/lib/api/report";
import { useUIStore } from "@/store/common/ui-store";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-store";

import React, { useRef, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateFormItem } from "@/components/common/form-input/date-field";
import { Calendar, ChevronLeft, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

const TaskHistoryPagination = () => {
  const { taskHistoryList, loadingKeys } = useTaskHistoryStore();
  const { isLoading, hasError } = useUIStore();
  //
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [generating, setGenerating] = useState(false);

  // ✅ 추가: 페이지 전환을 위한 step state
  const [step, setStep] = useState<"form" | "generating">("form");
  // ✅ 추가: 애니메이션을 위한 isTransitioning state (패턴 1 사용시)
  const [isTransitioning, setIsTransitioning] = useState(false);

  //
  const abortRef = useRef<AbortController | null>(null);

  if (isLoading(loadingKeys.LIST) || !taskHistoryList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  // const getReport = async () => {
  //   setReportText("");
  //   setReportOpen(true);
  //   setGenerating(true);

  //   abortRef.current = new AbortController();

  //   await fetchDailyReport(
  //     REPORT_MOCKUP,
  //     (text) => {
  //       setReportText((prev) => prev + text);
  //     },
  //     abortRef.current.signal,
  //   );

  //   setGenerating(false);
  // };

  const getReport = async () => {
    setReportText("");
    // ✅ 수정: 모달은 이미 열려있고, step만 변경
    // setReportOpen(true); // 이 줄은 제거하거나 주석처리

    // ✅ 추가: 페이지 전환 (패턴에 따라 다르게 적용)
    // 패턴 1 (슬라이드) 사용시:
    setIsTransitioning(true);
    setTimeout(() => {
      setStep("generating");
      setIsTransitioning(false);
    }, 300);

    // 패턴 2, 3 (페이드/아코디언) 사용시:
    // setStep('generating');

    setGenerating(true);

    abortRef.current = new AbortController();

    await fetchDailyReport(
      REPORT_MOCKUP,
      (text) => {
        setReportText((prev) => prev + text);
      },
      abortRef.current.signal,
    );

    setGenerating(false);
  };

  // const handleClose = (open: boolean) => {
  //   if (!open) {
  //     try {
  //       abortRef.current?.abort();
  //     } catch (error) {
  //       // abort 에러는 무시 (의도된 중단이므로)
  //       if (error instanceof Error && error.name !== "AbortError") {
  //         console.error("Unexpected error:", error);
  //       }
  //     }
  //     setGenerating(false);
  //   }
  //   setReportOpen(open);
  // };
  const handleClose = (open: boolean) => {
    if (!open) {
      try {
        abortRef.current?.abort();
      } catch (error) {
        // abort 에러는 무시 (의도된 중단이므로)
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Unexpected error:", error);
        }
      }
      setGenerating(false);
      // ✅ 추가: 모달 닫을 때 step 초기화
      setStep("form");
    }
    setReportOpen(open);
  };

  // ✅ 추가: 뒤로가기 핸들러
  const handleBack = () => {
    // 패턴 1 (슬라이드) 사용시:
    setIsTransitioning(true);
    setTimeout(() => {
      setStep("form");
      setIsTransitioning(false);
    }, 300);

    // 패턴 2, 3 (페이드/아코디언) 사용시:
    // setStep('form');
  };

  return (
    <CommonPagination totalCount={taskHistoryList.meta.totalCount}>
      {/* <ReportModal
        trigger={<Button size={"sm"} label="리포트" />}
        open={reportOpen}
        onOpenChange={(open) => {
          // if (open) getReport(); // 열릴 때만 getReport 호출
          handleClose(open); // 닫힐 때 abort 처리
        }}
      >

        <div className="relative min-h-[60vh]">
          <div
            className={`transition-all duration-300 ease-in-out ${
              step === "form"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="p-6 space-y-6">
              <div className="xl:max-w-3xl mx-auto">
                <ReportForm />
              </div>

              <button
                onClick={getReport}
                className="w-full max-w-md mx-auto block py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                리포트 생성 시작
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              step === "generating"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="p-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
              >
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">처음으로</span>
              </button>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">AI 리포트 생성중</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      분석 데이터를 처리하고 있습니다
                    </p>
                  </div>
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>

                <div className="min-h-[40vh] overflow-y-auto flex-1 whitespace-pre-wrap text-md font-medium">
                  <div
                    className="prose max-w-none p-6 bg-white rounded-lg shadow
                      prose-headings:mt-2 prose-headings:mb-1 
                      prose-p:my-0.5 prose-p:leading-relaxed
                      prose-ul:mt-0 prose-ul:mb-2 prose-li:my-0
                      prose-h1:mt-0 prose-h1:mb-4
                      prose-blockquote:my-2 prose-blockquote:py-1"
                  >
                    <ReactMarkdown>{reportText}</ReactMarkdown>
                    {generating && <span className="animate-pulse">▋</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </ReportModal> */}
    </CommonPagination>
  );
};

export default TaskHistoryPagination;

const ReportFormSchema = z
  .object({
    fromDt: z.date(),
    toDt: z.date(),
  })
  .refine(
    (data) => {
      if (data.fromDt && data.toDt) {
        return data.fromDt <= data.toDt;
      }
      return true;
    },
    {
      message: "시작일은 종료일보다 이전이어야 합니다.",
      path: ["toDt"], // 에러를 표시할 필드
    },
  );

const ReportForm = () => {
  const form = useForm<z.infer<typeof ReportFormSchema>>({
    resolver: zodResolver(ReportFormSchema),
  });

  // ✅ 날짜 유효성 검사 함수
  const validateDates = (fromDt: Date | undefined, toDt: Date | undefined) => {
    if (!fromDt || !toDt) return true;

    if (fromDt > toDt) {
      toast.error("날짜 오류", {
        description: "시작일은 종료일보다 이전이어야 합니다.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (values: z.infer<typeof ReportFormSchema>) => {
    console.log(values);
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="text-xl font-bold text-gray-900">분석 기간 설정</h3>
          <p className="text-sm text-gray-500 mt-1">
            리포트를 생성할 날짜 범위를 선택하세요
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* 타임라인 스타일 가로 레이아웃 */}
          <div className="relative">
            {/* 연결선 */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-full"></div>

            <div className="grid grid-cols-2 gap-8 relative">
              {/* 시작일 */}
              <FormField
                control={form.control}
                name="fromDt"
                render={({ field }) => (
                  <div className="relative">
                    {/* 타임라인 점 */}
                    <div className="absolute left-0 top-14 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg z-10"></div>

                    <div className="pl-10 pt-8">
                      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-md hover:shadow-xl hover:border-primary/50 transition-all">
                        {/* 스텝 표시 */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              1
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Step 1
                            </p>
                            <p className="text-base font-bold text-gray-800">
                              분석 시작일
                            </p>
                          </div>
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>

                        <DateFormItem
                          label="시작일"
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            // ✅ 시작일 변경 시 유효성 검사
                            const toDt = form.getValues("toDt");
                            if (date && toDt) {
                              validateDates(date, toDt);
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              />

              {/* 마지막일 */}
              <FormField
                control={form.control}
                name="toDt"
                render={({ field }) => (
                  <div className="relative">
                    {/* 타임라인 점 */}
                    <div className="absolute right-0 top-14 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg z-10"></div>

                    <div className="pr-10 pt-8">
                      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-md hover:shadow-xl hover:border-primary/50 transition-all">
                        {/* 스텝 표시 */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              2
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Step 2
                            </p>
                            <p className="text-base font-bold text-gray-800">
                              분석 종료일
                            </p>
                          </div>
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>

                        <DateFormItem
                          label="마지막일"
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            // ✅ 종료일 변경 시 유효성 검사
                            const fromDt = form.getValues("fromDt");
                            if (fromDt && date) {
                              validateDates(fromDt, date);
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* 하단 요약 정보 */}
          {form.watch("fromDt") && form.watch("toDt") && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  총 기간
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.ceil(
                    (form.watch("toDt").getTime() -
                      form.watch("fromDt").getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  일
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-xs font-semibold text-purple-600 mb-1">
                  시작일
                </p>
                <p className="text-lg font-bold text-purple-900">
                  {form.watch("fromDt").toLocaleDateString("ko-KR")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-xs font-semibold text-green-600 mb-1">
                  종료일
                </p>
                <p className="text-lg font-bold text-green-900">
                  {form.watch("toDt").toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
