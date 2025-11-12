import { Module } from '@nestjs/common';
import { UserIntegrationService } from './user_integration.service';
import { UserIntegrationController } from './user_integration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserIntegration } from './user_integration.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserIntegration])],
  providers: [UserIntegrationService],
  controllers: [UserIntegrationController]
})
export class UserIntegrationModule {}
