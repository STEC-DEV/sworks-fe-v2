export interface WorkplaceListItem {
  id: number;
  name: string;
  address: string;
  tel: string;
  //계약정보
  contractInfo?: ContractInfo[];
}

//계약정보(임시)
export interface ContractInfo {
  id: string;
  jobName: "미화" | "보안" | "설비" | "기타";
}

/**
 * 사업장 목업 데이터
 */
export const mockWorkplaceList: WorkplaceListItem[] = [
  {
    id: 1,
    name: "사업장 1",
    address: "서울특별시 구로구 도로명로 101",
    tel: "02-1234-1001",
    contractInfo: [
      { id: "c1_1", jobName: "보안" },
      { id: "c1_2", jobName: "설비" },
      { id: "c1_3", jobName: "설비" },
    ],
  },
  {
    id: 2,
    name: "사업장 2",
    address: "서울특별시 구로구 도로명로 102",
    tel: "02-1234-1002",
    contractInfo: [
      { id: "c2_1", jobName: "기타" },
      { id: "c2_2", jobName: "미화" },
      { id: "c2_3", jobName: "설비" },
    ],
  },
  {
    id: 3,
    name: "사업장 3",
    address: "서울특별시 구로구 도로명로 103",
    tel: "02-1234-1003",
    contractInfo: [],
  },
  {
    id: 4,
    name: "사업장 4",
    address: "서울특별시 구로구 도로명로 104",
    tel: "02-1234-1004",
    contractInfo: [],
  },
  {
    id: 5,
    name: "사업장 5",
    address: "서울특별시 구로구 도로명로 105",
    tel: "02-1234-1005",
    contractInfo: [{ id: "c5_1", jobName: "미화" }],
  },
  {
    id: 6,
    name: "사업장 6",
    address: "서울특별시 구로구 도로명로 106",
    tel: "02-1234-1006",
    contractInfo: [
      { id: "c6_1", jobName: "보안" },
      { id: "c6_2", jobName: "기타" },
    ],
  },
  {
    id: 7,
    name: "사업장 7",
    address: "서울특별시 구로구 도로명로 107",
    tel: "02-1234-1007",
    contractInfo: [{ id: "c7_1", jobName: "보안" }],
  },
  {
    id: 8,
    name: "사업장 8",
    address: "서울특별시 구로구 도로명로 108",
    tel: "02-1234-1008",
    contractInfo: [{ id: "c8_1", jobName: "보안" }],
  },
  {
    id: 9,
    name: "사업장 9",
    address: "서울특별시 구로구 도로명로 109",
    tel: "02-1234-1009",
    contractInfo: [{ id: "c9_1", jobName: "기타" }],
  },
  {
    id: 10,
    name: "사업장 10",
    address: "서울특별시 구로구 도로명로 110",
    tel: "02-1234-1010",
    contractInfo: [],
  },
  {
    id: 11,
    name: "사업장 11",
    address: "서울특별시 구로구 도로명로 111",
    tel: "02-1234-1011",
    contractInfo: [{ id: "c11_1", jobName: "설비" }],
  },
  {
    id: 12,
    name: "사업장 12",
    address: "서울특별시 구로구 도로명로 112",
    tel: "02-1234-1012",
    contractInfo: [
      { id: "c12_1", jobName: "기타" },
      { id: "c12_2", jobName: "기타" },
      { id: "c12_3", jobName: "보안" },
    ],
  },
  {
    id: 13,
    name: "사업장 13",
    address: "서울특별시 구로구 도로명로 113",
    tel: "02-1234-1013",
    contractInfo: [
      { id: "c13_1", jobName: "보안" },
      { id: "c13_2", jobName: "기타" },
      { id: "c13_3", jobName: "기타" },
    ],
  },
  {
    id: 14,
    name: "사업장 14",
    address: "서울특별시 구로구 도로명로 114",
    tel: "02-1234-1014",
    contractInfo: [
      { id: "c14_1", jobName: "설비" },
      { id: "c14_2", jobName: "미화" },
    ],
  },
  {
    id: 15,
    name: "사업장 15",
    address: "서울특별시 구로구 도로명로 115",
    tel: "02-1234-1015",
    contractInfo: [{ id: "c15_1", jobName: "미화" }],
  },
  {
    id: 16,
    name: "사업장 16",
    address: "서울특별시 구로구 도로명로 116",
    tel: "02-1234-1016",
    contractInfo: [],
  },
  {
    id: 17,
    name: "사업장 17",
    address: "서울특별시 구로구 도로명로 117",
    tel: "02-1234-1017",
    contractInfo: [
      { id: "c17_1", jobName: "설비" },
      { id: "c17_2", jobName: "기타" },
      { id: "c17_3", jobName: "기타" },
    ],
  },
  {
    id: 18,
    name: "사업장 18",
    address: "서울특별시 구로구 도로명로 118",
    tel: "02-1234-1018",
    contractInfo: [
      { id: "c18_1", jobName: "미화" },
      { id: "c18_2", jobName: "보안" },
      { id: "c18_3", jobName: "기타" },
    ],
  },
  {
    id: 19,
    name: "사업장 19",
    address: "서울특별시 구로구 도로명로 119",
    tel: "02-1234-1019",
    contractInfo: [
      { id: "c19_1", jobName: "미화" },
      { id: "c19_2", jobName: "미화" },
      { id: "c19_3", jobName: "미화" },
    ],
  },
  {
    id: 20,
    name: "사업장 20",
    address: "서울특별시 구로구 도로명로 120",
    tel: "02-1234-1020",
    contractInfo: [
      { id: "c20_1", jobName: "보안" },
      { id: "c20_2", jobName: "기타" },
    ],
  },
];
