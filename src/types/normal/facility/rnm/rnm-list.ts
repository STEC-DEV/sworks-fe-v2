interface FacilityListBase {
  seq: number;
  type: string;
  startDt: Date;
  endDt: Date;
  contents: string;
  company: string;
  tel: string;
  price: string;
}

interface FacilityListItem {
  facilitySeq: number;
  facilityCodeSeq: number;
  facilityCodeName: string;
  fromDt: Date;
  toDt?: Date;
  description: string;
  constractor: string;
  tel?: string;
  cost?: number;
}
