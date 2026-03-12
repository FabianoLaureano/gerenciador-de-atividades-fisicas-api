import { AuthenticateUser } from "../authenticate-user.js";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository.js";
import { PrismaUserCredentialRepository } from "../../repositories/prisma/prisma-user-credential-repository.js";

export function makeAuthenticateUser() {
  const userRepository = new PrismaUserRepository();
  const userCredentialRepository = new PrismaUserCredentialRepository();
  return new AuthenticateUser(userRepository, userCredentialRepository);
}
