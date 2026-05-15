"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(process.cwd(), "public"), {
        prefix: "/public/",
    });
    app.enableCors({ origin: "*" });
    app.setGlobalPrefix("api");
    const PORT = process.env.PORT || 8080;
    await app.listen(PORT);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map