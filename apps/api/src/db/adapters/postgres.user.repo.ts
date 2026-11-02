import { eq } from "drizzle-orm"
import { NodePgDatabase } from "drizzle-orm/node-postgres"
import {
  IUserRepository,
  UserEntity,
  CreateUserInput,
} from "../../modules/users/user.repository"
import { usersTable } from "../schema/postgres.schema"

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly db: NodePgDatabase<Record<string, unknown>>) {}

  async findById(id: string): Promise<UserEntity | null> {
    const [row] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
    return row ? this.map(row) : null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [row] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    return row ? this.map(row) : null
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const [row] = await this.db.insert(usersTable).values(input).returning()
    return this.map(row)
  }

  private map(row: typeof usersTable.$inferSelect): UserEntity {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}
