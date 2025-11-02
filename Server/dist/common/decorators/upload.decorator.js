"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFile = UploadFile;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
function UploadFile(options) {
    const storage = (0, multer_1.diskStorage)({
        destination: options.destination || "./uploads",
        filename: (req, file, cb) => {
            console.log("files", file);
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    });
    if (options.multiple) {
        return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)(options.fieldName, options.maxCount || 10, { storage })));
    }
    else {
        return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)(options.fieldName, { storage })));
    }
}
//# sourceMappingURL=upload.decorator.js.map