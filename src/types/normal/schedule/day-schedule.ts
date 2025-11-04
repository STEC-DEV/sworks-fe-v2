export interface DaySchedule {
  schSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  dates: Date;
  title: string;
  description?: string | null;
  isAllday: boolean;
  startDt: Date; //일정 시작일시
  endDt: Date; //일정 종료일시
  startTime: string;
  endTime: string | null;
  alarmYn: boolean;
  alarmDt: string;
  alarmOffsetDays: number | null;
  viewColor: string;
  logs: ScheduleLog;
}

export interface ScheduleLog {
  logSeq: number;
  logComments: string;
  logAttaches: ScheduleAttach[]; // 이건 안씀 서버 분리용
  beforeImages: ScheduleAttach[];
  afterImages: ScheduleAttach[]; //이미지 확장자 { ".jpg", ".jpeg", ".png", ".gif",".webp" };
  files: ScheduleAttach[]; // 파일 확장자  {".pdf", ".xlsx", ".xls", ".csv", ".docx", ".pptx", ".txt", ".zip"}
}

export interface ScheduleAttach {
  attachSeq: number;
  fileType: number; // 0 - 이미지, 1 - 사진
  photoType: number; // 0 - 일반(파일인경우), 1 - 이전, 2 - 이후
  path: string;
  fileName: string;
  fileLength: number; //파일크기
  comments: string | null;
  viewYn: boolean;
}

export interface NewScheduleAttach {
  attachSeq: number | null;
  photoType: number; // 0 - 일반(파일인경우), 1 - 이전, 2 - 이후
  attaches: File | null;
  comments: string;
  viewYn: boolean;
}

export type ScheduleFormAttach = NewScheduleAttach | ScheduleAttach;

export function isExistingAttach(
  data: ScheduleFormAttach
): data is ScheduleAttach {
  // console.log("============================");
  // console.log(data);
  // console.log("attachSeq" in data);
  // console.log("path" in data);
  // console.log("============================");
  return ("attachSeq" in data && "path" in data) || data.attaches === null;
}
// export const daySchedules: DaySchedule[] = [
//   {
//     schSeq: 1,
//     title: "야간 순찰(동 A·B)",
//     dates: new Date("2025-08-03"),
//     isAllday: true,
//     serviceTypeSeq: 31,
//     serviceTypeName: "보안",
//     startTime: "00:00",
//     endTime: "23:59",
//     viewColor: "1e90ff",
//   },
//   {
//     schSeq: 2,
//     title: "로비 유리창 정기 세척",
//     dates: new Date("2025-08-07"),
//     isAllday: false,
//     serviceTypeSeq: 32,
//     serviceTypeName: "미화",
//     startTime: "09:00",
//     endTime: "11:30",
//     viewColor: "2ecc71",
//   },
//   {
//     schSeq: 3,
//     title: "전기실 분전반 점검",
//     dates: new Date("2025-08-15"),
//     isAllday: false,
//     serviceTypeSeq: 33,
//     serviceTypeName: "설비",
//     startTime: "13:30",
//     endTime: "16:00",
//     viewColor: "e67e22",
//   },
//   {
//     schSeq: 4,
//     title: "공용부 월간 대청소",
//     dates: new Date("2025-08-22"),
//     isAllday: true,
//     serviceTypeSeq: 32,
//     serviceTypeName: "미화",
//     startTime: "00:00",
//     endTime: "23:59",
//     viewColor: "2ecc71",
//   },
//   {
//     schSeq: 5,
//     title: "출입권한 점검/갱신",
//     dates: new Date("2025-08-29"),
//     isAllday: false,
//     serviceTypeSeq: 31,
//     serviceTypeName: "보안",
//     startTime: "20:00",
//     endTime: "23:00",
//     viewColor: "1e90ff",
//   },
//   {
//     schSeq: 6,
//     title: "냉각탑 점검 및 세척",
//     dates: new Date("2025-09-02"),
//     isAllday: false,
//     serviceTypeSeq: 33,
//     serviceTypeName: "설비",
//     startTime: "08:00",
//     endTime: "12:00",
//     viewColor: "e67e22",
//   },
//   {
//     schSeq: 7,
//     title: "비상대응 모의훈련",
//     dates: new Date("2025-09-10"),
//     isAllday: true,
//     serviceTypeSeq: 31,
//     serviceTypeName: "보안",
//     startTime: "00:00",
//     endTime: "23:59",
//     viewColor: "1e90ff",
//   },
//   {
//     schSeq: 12,
//     title: "비상대응 모의훈련2",
//     dates: new Date("2025-09-10"),
//     isAllday: true,
//     serviceTypeSeq: 31,
//     serviceTypeName: "보안",
//     startTime: "00:00",
//     endTime: "23:59",
//     viewColor: "1e90ff",
//   },
//   {
//     schSeq: 8,
//     title: "카펫 스팀세척(3F)",
//     dates: new Date("2025-09-14"),
//     isAllday: false,
//     serviceTypeSeq: 32,
//     serviceTypeName: "미화",
//     startTime: "14:00",
//     endTime: "17:00",
//     viewColor: "2ecc71",
//   },
//   {
//     schSeq: 9,
//     title: "UPS 배터리 상태 점검",
//     dates: new Date("2025-09-21"),
//     isAllday: false,
//     serviceTypeSeq: 33,
//     serviceTypeName: "설비",
//     startTime: "10:00",
//     endTime: "12:00",
//     viewColor: "e67e22",
//   },
//   {
//     schSeq: 10,
//     title: "화장실 소독(전층)",
//     dates: new Date("2025-09-28"),
//     isAllday: true,
//     serviceTypeSeq: 32,
//     serviceTypeName: "미화",
//     startTime: "00:00",
//     endTime: "23:59",
//     viewColor: "2ecc71",
//   },
//   {
//     schSeq: 11,
//     title: "화장실 소독(전층)2",
//     dates: new Date("2025-09-28"),
//     isAllday: true,
//     serviceTypeSeq: 32,
//     serviceTypeName: "미화",
//     startTime: "00:00",
//     endTime: "23:59",
//     viewColor: "2ecc71",
//   },
// ];
