import { User } from "../../models/user.model.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  save(user: User): Promise<void>;
}
