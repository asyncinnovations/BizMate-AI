import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
  ///////////////////////////////////////////
  // APP ROOT ENDPOINT
  ///////////////////////////////////////////
  root_point_service(): {} {
    return { message: "Welcome To Bizmate-API", status: 200 };
  }
}
