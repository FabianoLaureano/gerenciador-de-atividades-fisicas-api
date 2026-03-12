import { UserCredential } from "../../models/user-credential.model.js";

export interface IUserCredentialRepository {
  create(userCredential: UserCredential): Promise<void>;
  findByUserId(userId: string): Promise<UserCredential | null>;
}
