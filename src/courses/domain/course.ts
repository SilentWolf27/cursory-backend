import { Module } from "../../modules/domain/module";

export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  visibility: "PUBLIC" | "PRIVATE";
  userId: string;
  modules?: Module[];
}

export interface CreateCourseData {
  title: string;
  description: string;
  slug: string;
  tags?: string[];
  visibility: "PUBLIC" | "PRIVATE";
  userId: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  slug?: string;
  tags?: string[];
  visibility?: "PUBLIC" | "PRIVATE";
}

/**
 * Create a new course entity
 * @param data - Course creation data
 * @returns Course entity
 */
export function createCourse(
  data: CreateCourseData
): Omit<Course, "id"> {
  return {
    title: data.title,
    description: data.description,
    slug: data.slug,
    tags: data.tags || [],
    visibility: data.visibility,
    userId: data.userId,
  };
}

/**
 * Update course data
 * @param course - Existing course
 * @param data - Update data
 * @returns Updated course data
 */
export function updateCourse(
  course: Course,
  data: UpdateCourseData
): Omit<Course, "id"> {
  return {
    title: data.title ?? course.title,
    description: data.description ?? course.description,
    slug: data.slug ?? course.slug,
    tags: data.tags ?? course.tags,
    visibility: data.visibility ?? course.visibility,
    userId: course.userId,
  };
}

/**
 * Check if course is public
 * @param course - Course to check
 * @returns True if course is public
 */
export function isPublic(course: Course): boolean {
  return course.visibility === "PUBLIC";
}

/**
 * Check if course is private
 * @param course - Course to check
 * @returns True if course is private
 */
export function isPrivate(course: Course): boolean {
  return course.visibility === "PRIVATE";
}

/**
 * Check if course has specific tag
 * @param course - Course to check
 * @param tag - Tag to search for
 * @returns True if course has the tag
 */
export function hasTag(course: Course, tag: string): boolean {
  return course.tags.includes(tag);
}
