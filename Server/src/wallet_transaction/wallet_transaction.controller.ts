import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { WalletTransactionService } from "./wallet_transaction.service";
import { WalletTransaction } from "./wallet_transaction.entity";

@Controller("wallet-transaction")
export class WalletTransactionController {
  constructor(
    private readonly walletTransactionService: WalletTransactionService
  ) {}

  //////////////////////////////////////
  // CREATE TRANSACTION
  /////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_wallet_transaction(@Body() data: Partial<WalletTransaction>) {
    try {
      const response =
        await this.walletTransactionService.create_wallet_transaction_service(
          data
        );
      return { message: "wallet transaction created", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////
  // GET ALL TRANSACTION
  /////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_wallet_transaction() {
    try {
      const response =
        await this.walletTransactionService.all_wallet_transaction_service();
      return { message: "all transaction retrived", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////
  // GET SINGLE TRANSACTION
  /////////////////////////////////////
  @Get("single/:uuid")
  @HttpCode(HttpStatus.OK)
  async single_wallet_transaction(@Param("uuid") uuid: string) {
    try {
      const response =
        await this.walletTransactionService.single_wallet_transaction_service(
          uuid
        );
      return { message: "single transaction retrived", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////
  // GET USER TRANSACTION
  /////////////////////////////////////
  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async user_wallet_transaction(@Param("userId") userId: string) {
    try {
      const response =
        await this.walletTransactionService.user_wallet_transaction_service(
          userId
        );
      return { message: "user transaction retrived", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////
  // UPDATE TRANSACTION
  /////////////////////////////////////
  @Put("status/:id")
  @HttpCode(HttpStatus.OK)
  async update_wallet_transaction_status(
    @Param("uuid") uuid: string,
    @Body("status") status: WalletTransaction["status"]
  ) {
    try {
      const response =
        await this.walletTransactionService.update_wallet_transaction_status_service(
          uuid,
          status
        );
      return { message: "trnsaction status updated", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////
  // REFUND TRANSACTION
  /////////////////////////////////////
  @Put("refund/:id")
  @HttpCode(HttpStatus.OK)
  async refund_wallet_transaction(@Param("uuid") uuid: string) {
    try {
      const response =
        await this.walletTransactionService.refund_wallet_transaction_service(
          uuid
        );
      return { message: "transaction marked refund", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////
  // DELETE TRANSACTION
  /////////////////////////////////////
  @Delete("delete/:uuid")
  @HttpCode(HttpStatus.OK)
  async delete_wallet_transaction(@Param("uuid") uuid: string) {
    try {
      const response =
        await this.walletTransactionService.delete_wallet_transaction_service(
          uuid
        );
      return { message: "trasaction deleted success", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////////////////////////
  // USER TRANSACTION FOR SUBSCRIPTION
  //////////////////////////////////////////////////////////
  @Get("user_subscription/:userId")
  @HttpCode(HttpStatus.OK)
  async subscription_wallet_transaction(@Param("userId") userId: string) {
    try {
      const response =
        await this.walletTransactionService.subscription_wallet_transaction_service(
          userId
        );
      return { message: "subscription transaction record retrived", response };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
