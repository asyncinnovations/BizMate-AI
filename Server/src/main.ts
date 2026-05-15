// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { connectDB } from "./config/db";
// // import "./jobs/reminderNotifier.js"; // starts cron when server starts
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Enable CORS if you plan to call API from frontend
//   app.enableCors({ origin: "*" });
//   app.setGlobalPrefix("api");
//   const PORT = process.env.PORT || 8080;

//   await app.listen(PORT);
//   connectDB();
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// }
// bootstrap();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Use process.cwd() but include the 'server' folder in the path
  app.useStaticAssets(join(process.cwd(), "public"), {
    prefix: "/public/",
  });

  // Enable CORS if you plan to call API from frontend
  app.enableCors({ origin: "*" });
  app.setGlobalPrefix("api");
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
