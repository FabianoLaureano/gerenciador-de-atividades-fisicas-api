import { prisma } from "../../lib/db.js";
import { IUserCredentialRepository } from "../interfaces/user-credential-repository-interface.js";
import { UserCredential } from "../../models/user-credential.model.js";

export class PrismaUserCredentialRepository implements IUserCredentialRepository {
  async create(userCredential: UserCredential): Promise<void> {
    await prisma.userCredential.create({
      data: {
        id: userCredential.id,
        userId: userCredential.userId,
        passwordHash: userCredential.passwordHash,
        createdAt: userCredential.createdAt,
        updatedAt: userCredential.updatedAt,
      },
    });
  }

  async findByUserId(userId: string): Promise<UserCredential | null> {
    const credential = await prisma.userCredential.findUnique({
      where: { userId },
    });

    if (!credential) return null;

    return UserCredential.restore({
      id: credential.id,
      userId: credential.userId,
      passwordHash: credential.passwordHash,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    });
  }
}
