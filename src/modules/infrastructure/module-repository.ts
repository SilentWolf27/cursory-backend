import { prisma } from "../../config/prisma";
import { Module, CreateModuleData, UpdateModuleData } from "../domain/module";
import { ModuleRepository } from "../domain/module-repository";

const MODULE_SELECT = {
  id: true,
  title: true,
  description: true,
  order: true,
  objectives: true,
  courseId: true,
} as const;

/**
 * Module repository implementation using Prisma
 */
export const moduleRepository: ModuleRepository = {
  async create(data: CreateModuleData, courseId: string): Promise<Module> {
    const module = await prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        objectives: data.objectives || [],
        courseId,
      },
      select: MODULE_SELECT,
    });
    return module;
  },

  async createMany(
    modules: CreateModuleData[],
    courseId: string
  ): Promise<Module[]> {
    // Use createMany for bulk insertion
    await prisma.module.createMany({
      data: modules.map((module) => ({
        title: module.title,
        description: module.description,
        order: module.order,
        objectives: module.objectives || [],
        courseId,
      })),
    });

    const createdModules = await prisma.module.findMany({
      where: {
        courseId,
        order: {
          in: modules.map((m) => m.order),
        },
      },
      select: MODULE_SELECT,
      orderBy: { order: "asc" },
    });

    return createdModules;
  },

  async findById(id: string): Promise<Module | null> {
    const module = await prisma.module.findFirst({
      where: { id, deletedAt: null },
      select: MODULE_SELECT,
    });
    if (!module) return null;
    return module;
  },

  async findByCourseId(courseId: string): Promise<Module[]> {
    const modules = await prisma.module.findMany({
      where: { courseId, deletedAt: null },
      select: MODULE_SELECT,
      orderBy: { order: "asc" },
    });
    return modules;
  },

  async update(id: string, data: UpdateModuleData): Promise<Module> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.objectives !== undefined) updateData.objectives = data.objectives;

    const module = await prisma.module.update({
      where: { id },
      data: updateData,
      select: MODULE_SELECT,
    });
    return module;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.module.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch (error) {
      return false;
    }
  },
};
