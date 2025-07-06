export interface CourseProps {
  id?: string;
  title: string;
  description: string;
  slug: string;
  visibility: "public" | "private";
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Course entity representing a learning course in the system
 */
export class Course {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly slug: string;
  public readonly visibility: "public" | "private";
  public readonly tags: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  constructor(props: CourseProps) {
    this.id = props.id || this.generateId();
    this.title = props.title;
    this.description = props.description;
    this.slug = props.slug;
    this.visibility = props.visibility;
    this.tags = props.tags || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;

    this.validate();
  }

  /**
   * Validates the course data according to business rules
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0)
      throw new Error("Course title is required");

    if (this.title.length > 255)
      throw new Error("Course title must be less than 255 characters");

    if (!this.description || this.description.trim().length === 0)
      throw new Error("Course description is required");

    if (!this.slug || this.slug.trim().length === 0)
      throw new Error("Course slug is required");

    if (!/^[a-z0-9-]+$/.test(this.slug)) {
      throw new Error(
        "Course slug must contain only lowercase letters, numbers, and hyphens"
      );
    }

    if (this.slug.length > 100)
      throw new Error("Course slug must be less than 100 characters");

    if (!["public", "private"].includes(this.visibility))
      throw new Error("Course visibility must be either 'public' or 'private'");
  }

  /**
   * Generates a unique ID for the course
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Checks if the course is public
   */
  public isPublic(): boolean {
    return this.visibility === "public";
  }

  /**
   * Checks if the course is private
   */
  public isPrivate(): boolean {
    return this.visibility === "private";
  }

  /**
   * Adds a tag to the course
   */
  public addTag(tag: string): void {
    if (!this.tags.includes(tag)) this.tags.push(tag);
  }

  /**
   * Removes a tag from the course
   */
  public removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) this.tags.splice(index, 1);
  }
}
