import crypto from "node:crypto"
import {
  IUserRepository,
  UserEntity,
  CreateUserInput,
} from "../../modules/users/user.repository"

export class InMemoryUserRepository implements IUserRepository {
  private readonly store: Map<string, UserEntity> = new Map()

  async findById(id: string): Promise<UserEntity | null> {
    return this.store.get(id) || null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return (
      Array.from(this.store.values()).find((u) => u.email === email) || null
    )
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const entity: UserEntity = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.store.set(entity.id, entity)
    return entity
  }
}
