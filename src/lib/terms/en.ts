import { Term } from "@/types/common/term";

export const PRIVACY_TERMS_EN: Term = {
  id: "privacy",
  title: "Privacy Policy Agreement",
  agreeLabel: "Agree to Privacy Policy (Required)",
  isRequired: true,
  version: "1.0",
  effectiveDate: "2024-01-01",
  sections: [
    {
      title: "Personal Information Collected",
      content: "",
      subSections: [
        {
          title:
            "A. The company collects the following personal information for complaint handling.",
          content: "- Required: Name, Phone Number",
        },
        {
          title:
            "B. The following information may be automatically collected during service use.",
          content:
            "- IP Address, Cookies, Visit Date/Time, Service Usage Records",
        },
      ],
    },
    {
      title: "Purpose of Collection and Use",
      content: "",
      subSections: [
        {
          title: "A. Complaint Reception and Response",
          content:
            "- Confirmation of complaints, contact for investigation, delivery of results, and identity verification",
        },
      ],
    },
    {
      title: "Retention and Use Period",
      content:
        "In principle, personal information is destroyed without delay once the purpose of collection has been fulfilled.\nHowever, information may be retained as follows when required by relevant laws or internal policy.",
      subSections: [
        {
          title: "A. Retention Reasons Under Internal Policy and Related Laws",
          content: [
            "Fraudulent use records - Basis: complaint handling and dispute resolution, Period: 1 year",
            "Identity verification records - Basis: Act on Promotion of IT Network Use and Information Protection, Period: 6 months",
            "Consumer complaint or dispute records - Basis: Act on Consumer Protection in Electronic Commerce, Period: 3 years",
          ],
        },
      ],
    },
  ],
};
