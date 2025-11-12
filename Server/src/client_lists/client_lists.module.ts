import { Module } from "@nestjs/common";
import { ClientListsService } from "./client_lists.service";
import { ClientListsController } from "./client_lists.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientList } from "./client_lists.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ClientList])],
  providers: [ClientListsService],
  controllers: [ClientListsController],
  exports: [ClientListsService],
})
export class ClientListsModule {}
