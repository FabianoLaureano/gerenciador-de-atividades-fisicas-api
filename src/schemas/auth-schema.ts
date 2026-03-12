import { z } from "zod";

export const RegisterBodySchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(6),
  weightInGrams: z.number().int().positive().optional(),
  heightInCentimeters: z.number().int().positive().optional(),
  age: z.number().int().positive().optional(),
  bodyFatPercentage: z.number().int().min(0).max(100).optional(),
  gender: z.string().optional(),
});

export const LoginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
