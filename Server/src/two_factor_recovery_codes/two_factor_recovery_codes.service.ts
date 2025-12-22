import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Repository, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TwoFactorRecoveryCode } from "./two_factor_recovery_codes.entity";
import { AuthUsers } from "src/auth/user.entity";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

@Injectable()
export class TwoFactorRecoveryCodesService {
  constructor(
    @InjectRepository(TwoFactorRecoveryCode)
    private readonly recoveryRepo: Repository<TwoFactorRecoveryCode>,
    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>
  ) {}

  ///////////////////////////////////////////////
  // Generate Recovery Codes for a User
  //////////////////////////////////////////////
  async generateRecoveryCodes(userId: string, count = 10): Promise<string[]> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const codes: string[] = [];

    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString("hex"); 
      codes.push(code);

      const hashedCode = await bcrypt.hash(code, 10);

      const recoveryCode = this.recoveryRepo.create({
        user_id: userId,
        code: hashedCode,
        is_used: false,
      });

      await this.recoveryRepo.save(recoveryCode);
    }

    return codes; 
  }

  ///////////////////////////////////////////
  // Verify Recovery Code
  ///////////////////////////////////////////
  async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const recoveryCodes = await this.recoveryRepo.find({
      where: { user_id: userId, is_used: false },
    });

    for (const rc of recoveryCodes) {
      const isMatch = await bcrypt.compare(code, rc.code);
      if (isMatch) {
        rc.is_used = true;
        await this.recoveryRepo.save(rc);
        return true;
      }
    }

    return false;
  }

  ///////////////////////////////////////////
  // Mark all Recovery Codes as Used (optional)
  ///////////////////////////////////////////
  async expireAllRecoveryCodes(userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const codes = await this.recoveryRepo.find({
      where: { user_id: userId, is_used: false },
    });
    for (const code of codes) {
      code.is_used = true;
      await this.recoveryRepo.save(code);
    }
  }

  ///////////////////////////////////////////
  // Get all active recovery codes (optional, admin/debug)
  ///////////////////////////////////////////
  async getActiveRecoveryCodes(
    userId: string
  ): Promise<TwoFactorRecoveryCode[]> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    return this.recoveryRepo.find({
      where: { user_id: userId, is_used: false },
    });
  }
}
