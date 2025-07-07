import { prisma } from "../../config/prisma";
import { UserRepository } from "../domain/user-repository";
import { User } from "../domain/user";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export const userRepository: UserRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id }, select: USER_SELECT }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email }, select: USER_SELECT }),

  create: (userData: Pick<User, "name" | "email" | "password">) =>
    prisma.user.create({ data: userData, select: USER_SELECT }),

  update: (id: string, data: Partial<User>) =>
    prisma.user.update({ where: { id }, data, select: USER_SELECT }),

  delete: (id: string) =>
    prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: USER_SELECT,
    }),
};
