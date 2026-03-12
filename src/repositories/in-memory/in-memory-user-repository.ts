import { IUserRepository } from "../interfaces/user-repository-interface.js";
import { User } from "../../models/user.model.js";

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((user) => user.id === id) ?? null;
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.items[index] = user;
    }
  }
}
