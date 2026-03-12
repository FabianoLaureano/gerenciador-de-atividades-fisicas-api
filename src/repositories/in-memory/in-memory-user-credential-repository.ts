import { IUserCredentialRepository } from "../interfaces/user-credential-repository-interface.js";
import { UserCredential } from "../../models/user-credential.model.js";

export class InMemoryUserCredentialRepository implements IUserCredentialRepository {
  public items: UserCredential[] = [];

  async create(userCredential: UserCredential): Promise<void> {
    this.items.push(userCredential);
  }

  async findByUserId(userId: string): Promise<UserCredential | null> {
    return this.items.find((c) => c.userId === userId) ?? null;
  }
}
