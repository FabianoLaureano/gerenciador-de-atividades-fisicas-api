import { z } from "zod";

const userCredentialPropsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type UserCredentialProps = z.infer<typeof userCredentialPropsSchema>;

export class UserCredential {
  private data: UserCredentialProps;

  private constructor(data: UserCredentialProps) {
    this.data = userCredentialPropsSchema.parse(data);
  }

  static create(
    data: Omit<UserCredentialProps, "id" | "createdAt" | "updatedAt">,
  ): UserCredential {
    const now = new Date();
    return new UserCredential({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(data: UserCredentialProps): UserCredential {
    return new UserCredential(data);
  }

  get id() {
    return this.data.id;
  }
  get userId() {
    return this.data.userId;
  }
  get passwordHash() {
    return this.data.passwordHash;
  }
  get createdAt() {
    return this.data.createdAt;
  }
  get updatedAt() {
    return this.data.updatedAt;
  }
}
