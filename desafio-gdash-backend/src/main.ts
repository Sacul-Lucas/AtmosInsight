import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 1500;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend-dev running on port ${PORT}`);
  });
}
bootstrap();
