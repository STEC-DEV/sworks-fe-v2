export interface MonthScheduleListItem {
  monthSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  date: Date;
}

export const monthSchedules: MonthScheduleListItem[] = [
  {
    monthSeq: 1,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    title: "야간 순찰 강화",
    date: new Date("2025-08-01"),
  },
  {
    monthSeq: 2,
    serviceTypeSeq: 32,
    serviceTypeName: "미화",
    title: "로비 유리창 정기 세척",
    date: new Date("2025-08-02"),
  },
  {
    monthSeq: 3,
    serviceTypeSeq: 33,
    serviceTypeName: "설비",
    title: "전기실 점검(분전반)",
    date: new Date("2025-08-03"),
  },
  {
    monthSeq: 4,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    title: "출입권한 월간 점검",
    date: new Date("2025-08-04"),
  },
  {
    monthSeq: 5,
    serviceTypeSeq: 32,
    serviceTypeName: "미화",
    title: "지하주차장 바닥 세척",
    date: new Date("2025-08-05"),
  },
  {
    monthSeq: 6,
    serviceTypeSeq: 33,
    serviceTypeName: "설비",
    title: "냉각탑 점검/세척",
    date: new Date("2025-08-06"),
  },
  {
    monthSeq: 7,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    title: "CCTV 사각지대 점검",
    date: new Date("2025-08-07"),
  },
  {
    monthSeq: 8,
    serviceTypeSeq: 32,
    serviceTypeName: "미화",
    title: "층별 공용부 카펫 청소",
    date: new Date("2025-08-08"),
  },
  {
    monthSeq: 9,
    serviceTypeSeq: 33,
    serviceTypeName: "설비",
    title: "UPS 배터리 상태 점검",
    date: new Date("2025-08-09"),
  },
  {
    monthSeq: 10,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    title: "비상 대피훈련 시나리오",
    date: new Date("2025-08-10"),
  },
  {
    monthSeq: 11,
    serviceTypeSeq: 32,
    serviceTypeName: "미화",
    title: "에스컬레이터 살균 청소",
    date: new Date("2025-08-11"),
  },
  {
    monthSeq: 12,
    serviceTypeSeq: 33,
    serviceTypeName: "설비",
    title: "보일러 연소상태 점검",
    date: new Date("2025-08-12"),
  },
  {
    monthSeq: 13,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    title: "야간 출입기록 샘플링",
    date: new Date("2025-08-13"),
  },
  {
    monthSeq: 14,
    serviceTypeSeq: 32,
    serviceTypeName: "미화",
    title: "외벽 저층부 물걸레 청소",
    date: new Date("2025-08-14"),
  },
  {
    monthSeq: 15,
    serviceTypeSeq: 33,
    serviceTypeName: "설비",
    title: "공조기 필터 교체",
    date: new Date("2025-08-15"),
  },
  {
    monthSeq: 16,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    title: "출입카드 분실현황 점검",
    date: new Date("2025-08-16"),
  },
  {
    monthSeq: 17,
    serviceTypeSeq: 32,
    serviceTypeName: "미화",
    title: "화장실 주기 소독",
    date: new Date("2025-08-17"),
  },
  {
    monthSeq: 18,
    serviceTypeSeq: 33,
    serviceTypeName: "설비",
    title: "소방펌프 주간 점검",
    date: new Date("2025-08-18"),
  },
];
