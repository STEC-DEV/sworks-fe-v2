export interface Construction {
  buildingSeq: number;
  buildingName: string;
  completeDt: Date;
  address: string;
  totalArea: string;
  usage: string;
  selfParkingSpaces: number;
  autoParkingSpaces: number;
  handicapParkingSpaces: number;
  dongs: BuildingInfo[] | undefined;
}

export interface BuildingInfo {
  dongSeq: number;
  dongName: string;
  completeDt: Date;
  address: string;
  totalArea: string;
  usage: string;
  selfParkingSpaces: number;
  autoParkingSpaces: number;
  towerTypeYn: boolean;
  handicapParkingSpaces: number;
  basementFloors: number;
  groundFloors: number;
  elvPassenger: number;
  elvCargo: number;
  elvEmr: number;
  subsCapacity: number;
  genCapacity: number;
  upsYn: boolean;
  overheadTank: number;
  overheadTankFireWater: number;
  underTank: number;
  underTankFireWater: number;
  firePanelType: number;
  sprinklerYn: boolean;
  gasExtYn: boolean;
  images: string | null;
  details: DynamicDetail[];
}

export interface EditBuildingInfo {
  dongSeq: number;
  dongName: string;
  completeDt: Date;
  address: string;
  totalArea: string;
  usage: string;
  selfParkingSpaces: number;
  autoParkingSpaces: number;
  towerTypeYn: boolean;
  handicapParkingSpaces: number;
  basementFloors: number;
  groundFloors: number;
  elvPassenger: number;
  elvCargo: number;
  elvEmr: number;
  subsCapacity: number;
  genCapacity: number;
  upsYn: boolean;
  overheadTank: number;
  overheadTankFireWater: number;
  underTank: number;
  underTankFireWater: number;
  firePanelType: number;
  sprinklerYn: boolean;
  gasExtYn: boolean;
  removeImage: boolean;
  images: string | null;
  detail: DynamicDetail[]; // 조회할때는 details 이고 수정 또는 추가할떄는 json 직렬화문제로 detail사용함
}

export interface UiBuildingInfo {
  dongSeq: number;
  dongName: string;
  completeDt: Date;
  address: string;
  totalArea: string;
  usage: string;
  selfParkingSpaces: number;
  autoParkingSpaces: number;
  towerTypeYn: boolean;
  handicapParkingSpaces: number;
  basementFloors: number;
  groundFloors: number;
  elvPassenger: number;
  elvCargo: number;
  elvEmr: number;
  subsCapacity: number;
  genCapacity: number;
  upsYn: boolean;
  overheadTank: number;
  overheadTankFireWater: number;
  underTank: number;
  underTankFireWater: number;
  firePanelType: number;
  sprinklerYn: boolean;
  gasExtYn: boolean;
  images: string | null;
  hvacDetails: DynamicDetail[];
  pumpDetails: DynamicDetail[];
}

interface DynamicDetail {
  detailSeq: number;
  typeGubun: boolean; //true - 냉난방 , false- pump
  typeSeq: number;
  typeName: string;
  capacity?: number; //냉난방 only - 냉난방용량
  flowRate?: number; // 펌프 only - 토출량
  totalHead?: number; // 펌프 only - 전양정
  qty: number;
  comments: string;
}

export const FirePanelType = [
  {
    value: 1,
    label: "R형",
  },
  {
    value: 2,
    label: "P형",
  },
];
