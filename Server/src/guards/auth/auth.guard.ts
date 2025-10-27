import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    // Check if header exists
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header missing");
    }

    // Check if it starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Invalid token format. Expected Bearer token"
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    try {
      // Verify token with JWT secret
      const decoded = jwt.verify(token, "BizMateAI");

      // Attach decoded payload to request
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
