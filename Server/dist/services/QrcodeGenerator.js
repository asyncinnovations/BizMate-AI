"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrcodeGenerator = void 0;
const QRCode = require("qrcode");
const QrcodeGenerator = async (otpauthUrl) => {
    const qrBase64 = await QRCode.toDataURL(otpauthUrl);
    return qrBase64;
};
exports.QrcodeGenerator = QrcodeGenerator;
//# sourceMappingURL=QrcodeGenerator.js.map