import React from "react";
import QRCode from "react-qr-code";

interface BaseQrProps {
  data: QRListItem;
}

const BaseQr = ({ data }: BaseQrProps) => {
  return <QRCode value={`http://localhost:3000/`}></QRCode>;
};

export default BaseQr;
