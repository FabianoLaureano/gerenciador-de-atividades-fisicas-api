import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/interfaces/user-repository-interface.js";
import { IUserCredentialRepository } from "../repositories/interfaces/user-credential-repository-interface.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { env } from "../env/index.js";

interface InputDto {
  email: string;
  password: string;
}

interface OutputDto {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class AuthenticateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userCredentialRepository: IUserCredentialRepository,
  ) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const credential = await this.userCredentialRepository.findByUserId(
      user.id,
    );

    if (!credential) {
      throw new UnauthorizedError();
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      credential.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError();
    }

    const token = jwt.sign({ sub: user.id, name: user.name }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
