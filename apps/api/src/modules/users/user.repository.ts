export interface UserEntity {
  id: string
  email: string
  name?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  name?: string | null
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  create(input: CreateUserInput): Promise<UserEntity>
}
