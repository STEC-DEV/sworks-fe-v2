export const REPORT_MOCKUP = {
  siteName: "대명루첸",
  managerName: "이동희",
  tasks: [
    {
      historySeq: 2031,
      taskSeq: 52,
      serviceTypeSeq: 24,
      serviceTypeName: "미화",
      targetDt: "2026-02-24",
      title: "[각층] 각층 E/L 문짝 및 홀 세척 작업",
      startDt: "2026-02-02",
      endDt: null,
      termType: 0,
      repeat: 1,
      users: [
        { userName: "[20층] 양정숙", count: 1 },
        { userName: "[19층] 조영옥(현대오토_사장실)", count: 1 },
        { userName: "[18층-케어링코리아] 천수정", count: 1 },
        { userName: "[17층] 정순덕", count: 1 },
        { userName: "[16층] 임인숙", count: 1 },
        { userName: "[15층] 이숙자", count: 0 },
        { userName: "[14층] 김외숙", count: 1 },
        { userName: "[13층] 강효진", count: 1 },
        { userName: "[11층] 오복연", count: 1 },
        { userName: "[9층] 김용애", count: 1 },
        { userName: "[8층] 김진순", count: 1 },
        { userName: "[7층] 강희숙", count: 1 },
        { userName: "[6층] 구인숙", count: 1 },
        { userName: "[5층] 박경란", count: 1 },
        { userName: "[2층 NX3] 이지연", count: 1 },
        { userName: "[3층 NX3] 신동월", count: 1 },
        { userName: "[여성 1F로비] 김영순 ", count: 1 },
        { userName: "[ 10F & 현대오토-내부] 서명옥 ", count: 1 },
        { userName: "[4층] 윤미경", count: 1 },
      ],
    },
    {
      historySeq: 2034,
      taskSeq: 55,
      serviceTypeSeq: 24,
      serviceTypeName: "미화",
      targetDt: "2026-02-24",
      title: "[여성로비]  남,여 공용화장실 청소",
      startDt: "2026-02-02",
      endDt: null,
      termType: 0,
      repeat: 3,
      users: [{ userName: "[여성 1F로비] 김영순 ", count: 3 }],
    },
    {
      historySeq: 2033,
      taskSeq: 54,
      serviceTypeSeq: 24,
      serviceTypeName: "미화",
      targetDt: "2026-02-24",
      title: "[여성 로비] 1층 공용 화장실 쓰레기 폐기",
      startDt: "2026-02-02",
      endDt: null,
      termType: 0,
      repeat: 2,
      users: [{ userName: "[여성 1F로비] 김영순 ", count: 2 }],
    },
    {
      historySeq: 2032,
      taskSeq: 53,
      serviceTypeSeq: 24,
      serviceTypeName: "미화",
      targetDt: "2026-02-24",
      title: "[각층] 각층 스텐류 세척 작업(소화전 박스 등)",
      startDt: "2026-02-02",
      endDt: null,
      termType: 0,
      repeat: 1,
      users: [
        { userName: "[20층] 양정숙", count: 1 },
        { userName: "[19층] 조영옥(현대오토_사장실)", count: 1 },
        { userName: "[18층-케어링코리아] 천수정", count: 1 },
        { userName: "[17층] 정순덕", count: 1 },
        { userName: "[16층] 임인숙", count: 1 },
        { userName: "[15층] 이숙자", count: 0 },
        { userName: "[14층] 김외숙", count: 1 },
        { userName: "[13층] 강효진", count: 1 },
        { userName: "[11층] 오복연", count: 1 },
        { userName: "[9층] 김용애", count: 1 },
        { userName: "[8층] 김진순", count: 1 },
        { userName: "[7층] 강희숙", count: 1 },
        { userName: "[6층] 구인숙", count: 1 },
        { userName: "[5층] 박경란", count: 1 },
        { userName: "[2층 NX3] 이지연", count: 1 },
        { userName: "[3층 NX3] 신동월", count: 1 },
        { userName: "[여성 1F로비] 김영순 ", count: 1 },
        { userName: "[ 10F & 현대오토-내부] 서명옥 ", count: 0 },
        { userName: "[4층] 윤미경", count: 1 },
      ],
    },
    {
      historySeq: 2029,
      taskSeq: 50,
      serviceTypeSeq: 24,
      serviceTypeName: "미화",
      targetDt: "2026-02-24",
      title: "[각층] 각층 남,여 화장실/공용부 이상 여부 확인",
      startDt: "2026-02-02",
      endDt: null,
      termType: 0,
      repeat: 2,
      users: [
        { userName: "[20층] 양정숙", count: 2 },
        { userName: "[19층] 조영옥(현대오토_사장실)", count: 2 },
        { userName: "[18층-케어링코리아] 천수정", count: 2 },
        { userName: "[17층] 정순덕", count: 0 },
        { userName: "[16층] 임인숙", count: 2 },
        { userName: "[15층] 이숙자", count: 0 },
        { userName: "[14층] 김외숙", count: 2 },
        { userName: "[13층] 강효진", count: 2 },
        { userName: "[11층] 오복연", count: 2 },
        { userName: "[9층] 김용애", count: 1 },
        { userName: "[8층] 김진순", count: 2 },
        { userName: "[7층] 강희숙", count: 2 },
        { userName: "[6층] 구인숙", count: 2 },
        { userName: "[5층] 박경란", count: 2 },
        { userName: "[2층 NX3] 이지연", count: 2 },
        { userName: "[3층 NX3] 신동월", count: 2 },
        { userName: "[ 10F & 현대오토-내부] 서명옥 ", count: 0 },
        { userName: "[4층] 윤미경", count: 1 },
      ],
    },
  ],
};

export async function fetchDailyReport(
  data: typeof REPORT_MOCKUP,
  onChunk: (text: string) => void,
  signal: AbortSignal,
) {
  const res = await fetch("http://localhost:8000/report/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

      for (const line of lines) {
        const raw = line.replace("data:", "").trim();
        if (raw === "[Done]") {
          return; // finally는 여전히 실행됨
        }
        try {
          const parsed = JSON.parse(raw);
          onChunk(parsed.text);
        } catch {
          // JSON 파싱 실패 무시
        }
      }
    }
  } catch (e) {
    // AbortError는 조용히 처리
    if (e instanceof Error && e.name === "AbortError") {
      console.log("리포트 생성 중단");
      return;
    }
    console.error("스트리밍 에러:", e);
    throw e;
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // releaseLock 실패 무시 (이미 해제된 경우)
    }
  }
}
