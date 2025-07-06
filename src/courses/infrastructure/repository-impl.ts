import { prisma } from "../../config/prisma";
import { BaseRepository } from "../../commons/repository/base-repository";
import { Course } from "../domain/entity";
import { CourseRepository } from "../domain/repository";
import { Visibility } from "@prisma/client";

export class CourseRepositoryImpl
  extends BaseRepository<Course>
  implements CourseRepository
{
  constructor() {
    super("course");
  }

  protected mapToDomain(data: any): Course {
    return new Course({
      id: data.id,
      title: data.title,
      description: data.description,
      slug: data.slug,
      visibility: data.visibility.toLowerCase() as "public" | "private",
      tags: data.tags,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  protected mapToPrismaCreate(course: Course) {
    return {
      title: course.title,
      description: course.description,
      slug: course.slug,
      visibility: course.visibility.toUpperCase() as Visibility,
      tags: course.tags,
    };
  }

  protected mapToPrismaUpdate(course: Course) {
    return {
      title: course.title,
      description: course.description,
      slug: course.slug,
      visibility: course.visibility.toUpperCase() as Visibility,
      tags: course.tags,
      updatedAt: new Date(),
    };
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const model = prisma[this.modelName] as any;
    const course = await model.findFirst({
      where: { slug, deletedAt: null },
    });
    return course ? this.mapToDomain(course) : null;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const model = prisma[this.modelName] as any;
    const count = await model.count({
      where: { slug, deletedAt: null },
    });
    return count > 0;
  }
}

export const courseRepository = new CourseRepositoryImpl();
