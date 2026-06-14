// src/main.ts
// UPDATED:
// 1. Uncommented reminderNotifier import — cron now runs on startup
// 2. Added RESEND_API_KEY check to catch missing env vars early

import { NestFactory }             from "@nestjs/core";
import { AppModule }               from "./app.module";
import { NestExpressApplication }  from "@nestjs/platform-express";
import { join }                    from "path";

// ── Start the reminder cron (runs every 10 minutes) ──────────────────────────
// This was previously commented out — enabling it means reminder emails
// will now fire when the trigger window is met.
import "./jobs/reminderNotifier";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploads (PDFs, snapshots, DOCX files)
  app.useStaticAssets(join(process.cwd(), "public"), {
    prefix: "/public/",
  });

  // CORS — tighten origin in production to your frontend domain
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  app.setGlobalPrefix("api");

  // ── Env guard ──────────────────────────────────────────────────────────────
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
