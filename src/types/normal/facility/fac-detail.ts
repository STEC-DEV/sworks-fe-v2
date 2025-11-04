export interface FacilityDetail {
  facilitySeq: number;
  facilityCodeSeq: number;
  facilityCodeName: string;
  fromDt: Date;
  toDt?: Date;
  description: string;
  constractor: string;
  tel?: string;
  cost?: number;
  attaches: Attach[];
}

export interface Attach {
  attachSeq: number;
  path: string;
  fileName: string;
  fileExt: string;
  fileLength: number;
}
