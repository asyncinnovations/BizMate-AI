"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
require("./jobs/reminderNotifier");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(process.cwd(), "public"), {
        prefix: "/public/",
    });
    app.enableCors({
        origin: process.env.CORS_ORIGIN ?? "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });
    app.setGlobalPrefix("api");
    const required = ["DATABASE_URL", "RESEND_API_KEY"];
    for (const key of required) {
        if (!process.env[key]) {
            console.warn(`[main] WARNING: ${key} is not set in environment`);
        }
    }
    const PORT = process.env.PORT || 8080;
    await app.listen(PORT);
    console.log(`🚀 BizMate AI server running on http://localhost:${PORT}`);
    console.log(`📧 Email: Resend (${process.env.RESEND_API_KEY ? "✓ configured" : "✗ RESEND_API_KEY missing"})`);
    console.log(`⏰ Reminder cron: active`);
}
bootstrap();
//# sourceMappingURL=main.js.map