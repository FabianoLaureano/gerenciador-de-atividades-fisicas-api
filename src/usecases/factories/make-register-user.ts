import { RegisterUser } from "../register-user.js";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository.js";
import { PrismaUserCredentialRepository } from "../../repositories/prisma/prisma-user-credential-repository.js";

export function makeRegisterUser() {
  const userRepository = new PrismaUserRepository();
  const userCredentialRepository = new PrismaUserCredentialRepository();
  return new RegisterUser(userRepository, userCredentialRepository);
}
