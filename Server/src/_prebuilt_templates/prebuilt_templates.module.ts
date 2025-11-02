import { Module } from '@nestjs/common';
import { PrebuiltTemplatesService } from './prebuilt_templates.service';
import { PrebuiltTemplatesController } from './prebuilt_templates.controller';

@Module({
  providers: [PrebuiltTemplatesService],
  controllers: [PrebuiltTemplatesController]
})
export class PrebuiltTemplatesModule {}
