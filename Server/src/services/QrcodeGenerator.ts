const QRCode = require("qrcode");

export const QrcodeGenerator = async (otpauthUrl: string) => {
  const qrBase64 = await QRCode.toDataURL(otpauthUrl);
  return qrBase64;
};
