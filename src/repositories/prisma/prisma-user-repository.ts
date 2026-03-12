import { prisma } from "../../lib/db.js";
import { IUserRepository } from "../interfaces/user-repository-interface.js";
import { User } from "../../models/user.model.js";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return User.restore({
      id: user.id,
      name: user.name,
      email: user.email,
      weightInGrams: user.weightInGrams,
      heightInCentimeters: user.heightInCentimeters,
      age: user.age,
      bodyFatPercentage: user.bodyFatPercentage,
      gender: user.gender,
    });
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        weightInGrams: user.weightInGrams,
        heightInCentimeters: user.heightInCentimeters,
        age: user.age,
        bodyFatPercentage: user.bodyFatPercentage,
        gender: user.gender,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.restore({
      id: user.id,
      name: user.name,
      email: user.email,
      weightInGrams: user.weightInGrams,
      heightInCentimeters: user.heightInCentimeters,
      age: user.age,
      bodyFatPercentage: user.bodyFatPercentage,
      gender: user.gender,
    });
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        weightInGrams: user.weightInGrams,
        heightInCentimeters: user.heightInCentimeters,
        age: user.age,
        bodyFatPercentage: user.bodyFatPercentage,
        gender: user.gender,
      },
    });
  }
}
