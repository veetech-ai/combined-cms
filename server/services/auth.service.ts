import { Pool } from "pg";
import { User } from "../../src/types";

export class AuthService {
  constructor(private pool: Pool) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT
        id, email, password, name, role,
        organization_id as "organizationId",
        store_id as "storeId"
      FROM users
      WHERE email = $1
    `;

    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findUserById(id: number): Promise<User | null> {
    const query = `
      SELECT
        id, email, password, name, role,
        organization_id as "organizationId",
        store_id as "storeId"
      FROM users
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async createRefreshToken(
    token: string,
    userId: number,
    expiresAt: Date
  ): Promise<void> {
    const query = `
      INSERT INTO refresh_tokens (token, user_id, expires_at)
      VALUES ($1, $2, $3)
    `;

    await this.pool.query(query, [token, userId, expiresAt]);
  }

  async findRefreshToken(token: string): Promise<{
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
  } | null> {
    const query = `
      SELECT
        id,
        token,
        user_id as "userId",
        expires_at as "expiresAt"
      FROM refresh_tokens
      WHERE token = $1
    `;

    const result = await this.pool.query(query, [token]);
    return result.rows[0] || null;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    const query = `
      DELETE FROM refresh_tokens
      WHERE token = $1
    `;

    await this.pool.query(query, [token]);
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    const query = `
      DELETE FROM refresh_tokens
      WHERE expires_at < NOW()
    `;

    await this.pool.query(query);
  }
}
