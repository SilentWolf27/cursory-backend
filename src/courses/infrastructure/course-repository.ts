import { prisma } from "../../config/prisma";
import { Course, CreateCourseData, UpdateCourseData } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";

const COURSE_SELECT = {
  id: true,
  title: true,
  description: true,
  slug: true,
  tags: true,
  visibility: true,
  userId: true,
} as const;

/**
 * Course repository implementation using Prisma
 */
export const courseRepository: CourseRepository = {
  async create(data: CreateCourseData, userId: string): Promise<Course> {
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        tags: data.tags || [],
        visibility: data.visibility,
        userId,
      },
      select: COURSE_SELECT,
    });
    return course;
  },

  async findById(id: string): Promise<Course | null> {
    const course = await prisma.course.findFirst({
      where: { id, deletedAt: null },
      select: COURSE_SELECT,
    });
    if (!course) return null;
    return course;
  },

  async findBySlug(slug: string): Promise<Course | null> {
    const course = await prisma.course.findFirst({
      where: { slug, deletedAt: null },
      select: COURSE_SELECT,
    });
    if (!course) return null;
    return course;
  },

  async findByUserId(userId: string): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: { userId, deletedAt: null },
      select: COURSE_SELECT,
      orderBy: { createdAt: "desc" },
    });
    return courses;
  },

  async findPublic(): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: { visibility: "PUBLIC", deletedAt: null },
      select: COURSE_SELECT,
      orderBy: { createdAt: "desc" },
    });
    return courses;
  },

  async update(id: string, data: UpdateCourseData): Promise<Course> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      select: COURSE_SELECT,
    });
    return course;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.course.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async slugExists(slug: string): Promise<boolean> {
    const count = await prisma.course.count({
      where: { slug, deletedAt: null },
    });
    return count > 0;
  },
};
