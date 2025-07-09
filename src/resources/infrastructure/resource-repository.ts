import { prisma } from "../../config/prisma";
import {
  Resource,
  CreateResourceData,
  UpdateResourceData,
  ResourceType,
} from "../domain/resource";
import { ResourceRepository } from "../domain/resource-repository";

const RESOURCE_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  url: true,
  courseId: true,
} as const;

export const resourceRepository: ResourceRepository = {
  async create(data: CreateResourceData, courseId: string): Promise<Resource> {
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        courseId,
      },
      select: RESOURCE_SELECT,
    });
    return { ...resource, type: resource.type as ResourceType };
  },

  async findById(id: string): Promise<Resource | null> {
    const resource = await prisma.resource.findFirst({
      where: { id, deletedAt: null },
      select: RESOURCE_SELECT,
    });
    if (!resource) return null;
    return { ...resource, type: resource.type as ResourceType };
  },

  async findByCourseId(courseId: string): Promise<Resource[]> {
    const resources = await prisma.resource.findMany({
      where: { courseId, deletedAt: null },
      select: RESOURCE_SELECT,
      orderBy: { createdAt: "asc" },
    });
    return resources.map((resource) => ({
      ...resource,
      type: resource.type as ResourceType,
    }));
  },

  async update(id: string, data: UpdateResourceData): Promise<Resource> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.url !== undefined) updateData.url = data.url;

    const resource = await prisma.resource.update({
      where: { id },
      data: updateData,
      select: RESOURCE_SELECT,
    });
    return { ...resource, type: resource.type as ResourceType };
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.resource.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async exists(id: string): Promise<boolean> {
    const count = await prisma.resource.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  },
};
