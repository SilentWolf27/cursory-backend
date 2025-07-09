export enum ResourceType {
  PDF = "PDF",
  VIDEO = "VIDEO",
  WEBPAGE = "WEBPAGE",
  DOCUMENT = "DOCUMENT",
  PRESENTATION = "PRESENTATION",
  CODE_REPOSITORY = "CODE_REPOSITORY",
  BOOK = "BOOK",
  ARTICLE = "ARTICLE",
  WEBINAR = "WEBINAR",
  TOOL = "TOOL",
  COURSE_NOTES = "COURSE_NOTES",
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  courseId: string;
}

export interface CreateResourceData {
  title: string;
  description: string;
  type: ResourceType;
  url: string;
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  type?: ResourceType;
  url?: string;
}

/**
 * Create a new resource entity
 * @param data - Resource creation data
 * @returns Resource entity without id and courseId
 */
export function createResource(
  data: CreateResourceData
): Omit<Resource, "id" | "courseId"> {
  return {
    title: data.title,
    description: data.description,
    type: data.type,
    url: data.url,
  };
}

/**
 * Update resource data
 * @param resource - Existing resource
 * @param data - Update data
 * @returns Updated resource data
 */
export function updateResource(
  resource: Resource,
  data: UpdateResourceData
): Omit<Resource, "id"> {
  return {
    title: data.title ?? resource.title,
    description: data.description ?? resource.description,
    type: data.type ?? resource.type,
    url: data.url ?? resource.url,
    courseId: resource.courseId,
  };
}

/**
 * Check if resource is downloadable (PDF, DOCUMENT, etc.)
 * @param resource - Resource to check
 * @returns True if resource is downloadable
 */
export function isDownloadable(resource: Resource): boolean {
  return [
    ResourceType.PDF,
    ResourceType.DOCUMENT,
    ResourceType.PRESENTATION,
    ResourceType.BOOK,
    ResourceType.COURSE_NOTES,
  ].includes(resource.type);
}

/**
 * Check if resource is interactive (TOOL, CODE_REPOSITORY, etc.)
 * @param resource - Resource to check
 * @returns True if resource is interactive
 */
export function isInteractive(resource: Resource): boolean {
  return [ResourceType.TOOL, ResourceType.CODE_REPOSITORY].includes(
    resource.type
  );
}

/**
 * Check if resource is media (VIDEO, WEBINAR, etc.)
 * @param resource - Resource to check
 * @returns True if resource is media
 */
export function isMedia(resource: Resource): boolean {
  return [ResourceType.VIDEO, ResourceType.WEBINAR].includes(resource.type);
}

/**
 * Check if resource is web-based (WEBPAGE, ARTICLE, etc.)
 * @param resource - Resource to check
 * @returns True if resource is web-based
 */
export function isWebBased(resource: Resource): boolean {
  return [
    ResourceType.WEBPAGE,
    ResourceType.ARTICLE,
    ResourceType.WEBINAR,
  ].includes(resource.type);
}
