import QRCode from "qrcode";

// QR코드 SVG 옵션 타입
interface QRSVGOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

interface DownloadQRCodeSVGProps {
  url: string;
  fileName: string;
  options?: QRSVGOptions;
}

export const downloadQRCodeSVG = async (
  url: string,
  fileName: string,
  options = {}
) => {
  try {
    if (!url.trim()) {
      throw new Error("URL이 비어있습니다.");
    }
    if (!fileName.trim()) {
      throw new Error("파일명이 비어있습니다.");
    }

    // URL 형식 검사 (선택사항)
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url.trim())) {
      console.warn("유효한 URL 형식이 아닐 수 있습니다:", url);
    }

    const defaultOptions: Required<QRSVGOptions> = {
      width: 500,
      margin: 4,
      darkColor: "#000000",
      lightColor: "#FFFFFF",
      errorCorrectionLevel: "M",
    };

    const finalOptions = { ...defaultOptions, ...options };

    // 3. QR코드를 SVG 문자열로 생성
    const svgString = await QRCode.toString(url.trim(), {
      type: "svg",
      width: finalOptions.width,
      margin: finalOptions.margin,
      color: {
        dark: finalOptions.darkColor,
        light: finalOptions.lightColor,
      },
      errorCorrectionLevel: finalOptions.errorCorrectionLevel,
    });

    // 4. 파일명 정리 (특수문자 제거)
    const cleanFileName = fileName
      .replace(/[^a-zA-Z0-9가-힣_-]/g, "_")
      .replace(/_{2,}/g, "_")
      .trim();

    // 5. Blob 생성 및 다운로드
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${cleanFileName}.svg`;

    // DOM에 임시로 추가하여 클릭
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 메모리 해제
    URL.revokeObjectURL(downloadUrl);

    console.log(`✅ SVG QR코드 다운로드 완료: ${cleanFileName}.svg`);
    return;
  } catch (err) {
    console.error(err);
    throw new Error(
      `QR코드 다운로드 실패: ${
        err instanceof Error ? err.message : "알 수 없는 오류"
      }`
    );
  }
};
