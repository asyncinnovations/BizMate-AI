import { Module } from '@nestjs/common';
import { DocumentGenController } from './document_gen.controller';
import { DocumentGenService } from './document_gen.service';

@Module({
  providers: [DocumentGenService],
  controllers: [DocumentGenController]
})
export class DocumentGenModule {}
