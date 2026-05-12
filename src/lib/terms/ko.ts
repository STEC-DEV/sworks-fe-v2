import { Term } from "@/types/common/term";

export const PRIVACY_TERMS_KO: Term = {
  id: "privacy",
  title: "개인정보 수집 및 이용 동의",
  agreeLabel: "개인정보 수집 및 이용 동의 (필수)",
  isRequired: true,
  version: "1.0",
  effectiveDate: "2024-01-01",
  sections: [
    {
      title: "수집하는 개인정보의 항목",
      content: "",
      subSections: [
        {
          title:
            "가. 회사는 민원 접수 및 답변을 위해 아래와 같은 개인정보를 수집하고 있습니다.",
          content: "- 필수항목 : 성함, 휴대폰 번호",
        },
        {
          title:
            "나. 서비스 이용 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.",
          content: "- IP Address, 쿠키, 방문 일시, 서비스 이용 기록",
        },
      ],
    },
    {
      title: "개인정보의 수집 및 이용 목적",
      content: "",
      subSections: [
        {
          title: "가. 민원 접수 및 결과 회신",
          content:
            "- 민원 사항의 확인, 사실조사를 위한 연락·통지, 처리 결과 회신 및 본인 확인",
        },
      ],
    },
    {
      title: "개인정보의 보유 및 이용기간",
      content:
        "이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.\n단, 관련 법령 및 내부 방침에 의해 보존할 필요가 있는 경우 아래와 같이 보유합니다.",
      subSections: [
        {
          title: "가. 내부 방침 및 관련 법령에 의한 정보보유 사유",
          content: [
            "부정이용기록 - 보존 근거: 불만 처리 및 분쟁 해결, 보존 기간: 1년",
            "본인확인에 관한 기록 - 보존 근거: 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 보존 기간: 6개월",
            "소비자의 불만 또는 분쟁처리에 관한 기록 - 보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률, 보존 기간: 3년",
          ],
        },
      ],
    },
  ],
};
