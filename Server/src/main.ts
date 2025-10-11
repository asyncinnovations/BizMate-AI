import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: Enable CORS if you plan to call API from frontend
  app.enableCors();
  app.setGlobalPrefix("api");
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
