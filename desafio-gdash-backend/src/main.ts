import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 1500);
  console.log(`Servidor rodando em http://localhost:${process.env.PORT || 1500}`);
}
bootstrap();
