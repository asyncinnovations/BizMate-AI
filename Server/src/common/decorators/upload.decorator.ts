import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

interface UploadOptions {
  fieldName: string; // Form field name
  destination?: string; // Upload folder
  multiple?: boolean; // Single or multiple files
  maxCount?: number; // Max files if multiple
}

export function UploadFile(options: UploadOptions) {
  const storage = diskStorage({
    destination: options.destination || "./uploads",
    filename: (req: any, file: any, cb: any) => {
      console.log("files", file);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  if (options.multiple) {
    return applyDecorators(
      UseInterceptors(
        FilesInterceptor(options.fieldName, options.maxCount || 10, { storage })
      )
    );
  } else {
    return applyDecorators(
      UseInterceptors(FileInterceptor(options.fieldName, { storage }))
    );
  }
}
