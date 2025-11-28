import { ServiceType } from "@/types/common/basic-code";

export interface Notice {
  noticeSeq: number;
  title: string;
  description: string;
  endDt: Date;
  viewYn: boolean;
  serviceTypes: ServiceType[];
  imageAttaches: Attaches[];
  fileAttaches: Attaches[];
}

interface Attaches {
  attachSeq: number;
  fileType: number;
  path: string;
  fileName: string;
  fileLength: number;
}
