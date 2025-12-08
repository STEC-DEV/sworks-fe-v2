import { ServiceType } from "@/types/common/basic-code";

export interface NoticeListItem {
  noticeSeq: number;
  title: string;
  description: string;
  endDt: Date;
  isPin: boolean;
  creator: string;
  createDt: Date;
  viewYn: boolean;
  serviceTypes: ServiceType[];
}
