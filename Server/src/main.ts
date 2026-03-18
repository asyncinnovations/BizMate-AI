import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { connectDB } from "./config/db";
// import "./jobs/reminderNotifier.js"; // starts cron when server starts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if you plan to call API from frontend
  app.enableCors({ origin: "*" });
  app.setGlobalPrefix("api");
  const PORT = process.env.PORT || 8080;

  await app.listen(PORT);
  connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
