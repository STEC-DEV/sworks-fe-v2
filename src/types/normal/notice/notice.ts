import { ServiceType } from "@/types/common/basic-code";

export interface NoticeListItem {
  noticeSeq: number;
  title: string;
  description: string;
  endDt: Date;
  isPin: boolean;
  creator: string;
  viewYn: boolean;
  serviceTypes: ServiceType[];
}
