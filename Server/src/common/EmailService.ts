import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  ////////////////////////////////////////////////////////
  // SEND EMAIL TO PROVIDER
  ////////////////////////////////////////////////////////
  async send_email(data: any) {
    return { success: true, message: "email send success" };
  }
}
