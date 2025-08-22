interface EquipmentListItem {
  equipSeq: number;
  //업무유형 시퀀스
  serviceTypeSeq: number;
  //업무유형 이름
  serviceTypeName: string;
  //장비번호
  serial: string;
  //장비명
  name: string;
  //용도
  usage: string;
  //메이커
  maker: string;
  //용량
  capacity: string;
  //구매자
  buyer: string;
  //구매일
  buyDt: Date;
  //비용
  cost?: number;
  //수량
  amount: number;
  //이미지
  images?: string;
}
