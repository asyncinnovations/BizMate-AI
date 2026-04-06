import { Module } from '@nestjs/common';
import { DocumentHistoryService } from './document_history.service';
import { DocumentHistoryController } from './document_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentHistory } from './document_history.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DocumentHistory])],
  providers: [DocumentHistoryService],
  controllers: [DocumentHistoryController]
})
export class DocumentHistoryModule {}
