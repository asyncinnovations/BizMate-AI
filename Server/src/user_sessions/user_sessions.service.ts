import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSession } from "./user_sessions.entity";
import { AuthUsers } from "src/auth/user.entity";

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepo: Repository<UserSession>,
    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>
  ) {}

  ///////////////////////////////////////
  // CREATE USER SESSION
  ///////////////////////////////////////
  async create_user_session_service(createDto) {
    const user = await this.userRepo.findOne({
      where: { uuid: createDto.user_id },
    });
    if (!user) throw new NotFoundException("User not found");

    const session = this.userSessionRepo.create({
      user_id: user.uuid,
      device_name: createDto.device_name,
      ip_address: createDto.ip_address,
      browser: createDto.browser,
      os: createDto.os,
      location: createDto.location,
    });

    return this.userSessionRepo.save(session);
  }

  ///////////////////////////////////////
  // GET ALL USER SESSIONS
  ///////////////////////////////////////
  async get_all_sessions_service() {
    return this.userSessionRepo.find();
  }

  ///////////////////////////////////////
  // GET SESSIONS BY USER
  ///////////////////////////////////////
  async get_user_sessions_service(userId: string) {
    const sessions = await this.userSessionRepo.find({
      where: { user_id: userId, is_active: true },
      //   relations: ["users"],
    });
    return sessions;
  }

  ///////////////////////////////////////
  // UPDATE LAST ACTIVE / SESSION INFO
  ///////////////////////////////////////
  async update_user_session_service(uuid: string) {
    const session = await this.userSessionRepo.findOne({ where: { uuid } });
    if (!session) throw new NotFoundException("Session not found");

    Object.assign(session, { last_active: new Date() });
    return this.userSessionRepo.save(session);
  }

  ///////////////////////////////////////
  // LOGOUT / DEACTIVATE SESSION
  ///////////////////////////////////////
  async deactivate_user_session_service(uuid: string) {
    const session = await this.userSessionRepo.findOne({ where: { uuid } });
    if (!session) throw new NotFoundException("Session not found");

    session.is_active = false;
    return this.userSessionRepo.save(session);
  }
}
