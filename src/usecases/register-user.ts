import bcrypt from "bcryptjs";
import { IUserRepository } from "../repositories/interfaces/user-repository-interface.js";
import { IUserCredentialRepository } from "../repositories/interfaces/user-credential-repository-interface.js";
import { User } from "../models/user.model.js";
import { UserCredential } from "../models/user-credential.model.js";
import { BadRequestError } from "../errors/bad-request-error.js";

interface InputDto {
  name: string;
  email: string;
  password: string;
  weightInGrams?: number;
  heightInCentimeters?: number;
  age?: number;
  bodyFatPercentage?: number;
  gender?: string;
}

interface OutputDto {
  id: string;
  name: string;
  email: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userCredentialRepository: IUserCredentialRepository,
  ) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = User.create({
      name: dto.name,
      email: dto.email,
      weightInGrams: dto.weightInGrams ?? null,
      heightInCentimeters: dto.heightInCentimeters ?? null,
      age: dto.age ?? null,
      bodyFatPercentage: dto.bodyFatPercentage ?? null,
      gender: dto.gender ?? null,
    });

    const credential = UserCredential.create({
      userId: user.id,
      passwordHash,
    });

    await this.userRepository.create(user);
    await this.userCredentialRepository.create(credential);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
