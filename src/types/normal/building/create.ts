interface CreateBuilding {
  buildingSeq: number | undefined;
  dongName: string;
  completeDt: Date;
  address: string;
  totalArea: string;
  usage: string;
  selfParkingSpaces: number;
  autoParkingSpaces: number;
  handicapParkingSpaces: number;
  towerTypeYn: boolean;

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
  firePanelType: number | undefined;
  sprinklerYn: boolean;
  gasExtYn: boolean;
  images: File[];
  hvacDetails: DynamicDetail[];
  pumpDetails: DynamicDetail[];
}

interface DynamicDetail {
  typeSeq: number; //
  capacity?: number; //냉난방 only - 냉난방용량
  flowRate?: number; // 펌프 only - 토출량
  totalHead?: number; // 펌프 only - 전양정
  qty: number;
  comments: string;
}
