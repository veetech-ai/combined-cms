import { DBService } from '../../services/db.service';

export class AuthService extends DBService {
  async findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        organizationId: true,
        storeId: true,
        status: true
      }
    });
  }

  async findUserById(id: string) {
    return this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        organizationId: true,
        storeId: true,
        status: true
      }
    });
  }

  async createRefreshToken(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<void> {
    await this.db.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  async findRefreshToken(token: string): Promise<{
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
  } | null> {
    return this.db.refreshToken.findUnique({
      where: { token },
      select: {
        id: true,
        token: true,
        userId: true,
        expiresAt: true
      }
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.db.refreshToken.delete({
      where: { token }
    });
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}
