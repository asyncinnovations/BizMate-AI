"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: "*" });
    app.setGlobalPrefix("api");
    const PORT = process.env.PORT || 4040;
    await app.listen(PORT);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map