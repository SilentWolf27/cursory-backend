export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  objectives: string[];
  courseId: string;
}

export interface CreateModuleData {
  title: string;
  description: string;
  order: number;
  objectives?: string[];
  courseId: string;
}

export interface UpdateModuleData {
  title?: string;
  description?: string;
  order?: number;
  objectives?: string[];
}

/**
 * Create a new module entity
 * @param data - Module creation data
 * @returns Module entity
 */
export function createModule(data: CreateModuleData): Omit<Module, "id"> {
  return {
    title: data.title,
    description: data.description,
    order: data.order,
    objectives: data.objectives || [],
    courseId: data.courseId,
  };
}

/**
 * Update module data
 * @param module - Existing module
 * @param data - Update data
 * @returns Updated module data
 */
export function updateModule(
  module: Module,
  data: UpdateModuleData
): Omit<Module, "id"> {
  return {
    title: data.title ?? module.title,
    description: data.description ?? module.description,
    order: data.order ?? module.order,
    objectives: data.objectives ?? module.objectives,
    courseId: module.courseId,
  };
}
