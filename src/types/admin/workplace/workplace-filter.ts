export const WorkType = {
  24: "미화",
  25: "보안",
  26: "시설",
  27: "방제",
  28: "기타",
};

export type WorkType = (typeof WorkType)[keyof typeof WorkType];

// 34공통, 빌딩, 병원, 대학교, 아파트, 메트로, 40공장
