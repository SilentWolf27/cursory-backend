import type { Request, Response } from "express";
import { User } from "../../auth/domain/user";
import { moduleRepository } from "./module-repository";
import { courseRepository } from "../../courses/infrastructure/course-repository";
import {
  createModuleUseCase,
  CreateModuleRequest,
} from "../application/create-module-use-case";

import {
  updateModuleUseCase,
  UpdateModuleRequest,
} from "../application/update-module-use-case";
import {
  deleteModuleUseCase,
  DeleteModuleRequest,
} from "../application/delete-module-use-case";
import {
  generateModulesUseCase,
  GenerateModulesRequest,
} from "../application/generate-modules-use-case";
import {
  createModulesBulkUseCase,
  CreateModulesBulkRequest,
} from "../application/create-modules-bulk-use-case";

/**
 * Create a new module
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleCreateModule(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { courseId } = req.params;
  const { title, description, order, objectives } = req.body;

  if (!courseId) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  const request: CreateModuleRequest = {
    data: {
      title,
      description,
      order,
      objectives,
    },
    userId: user.id,
    courseId,
  };

  const { module } = await createModuleUseCase(
    request,
    moduleRepository,
    courseRepository
  );

  res.status(201).json(module);
}

/**
 * Update module by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleUpdateModule(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { courseId, moduleId } = req.params;
  const { title, description, order, objectives } = req.body;

  if (!courseId) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  if (!moduleId) {
    res.status(400).json({ error: "Module ID is required" });
    return;
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (order !== undefined) updateData.order = order;
  if (objectives !== undefined) updateData.objectives = objectives;

  const request: UpdateModuleRequest = {
    moduleId,
    data: updateData,
    userId: user.id,
    courseId,
  };

  const { module } = await updateModuleUseCase(
    request,
    moduleRepository,
    courseRepository
  );

  res.status(200).json(module);
}

/**
 * Delete module by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleDeleteModule(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { courseId, moduleId } = req.params;

  if (!courseId) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  if (!moduleId) {
    res.status(400).json({ error: "Module ID is required" });
    return;
  }

  const request: DeleteModuleRequest = {
    moduleId,
    userId: user.id,
    courseId,
  };

  await deleteModuleUseCase(request, moduleRepository, courseRepository);

  res.status(204).send();
}

/**
 * Generate modules for a course using AI
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleGenerateModules(
  req: Request,
  res: Response
): Promise<void> {
  const { courseId } = req.params;
  const user = req.user as User;
  const { suggestedTopics, numberOfModules, approach } = req.body;

  if (!courseId) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  const request: GenerateModulesRequest = {
    courseId,
    suggestedTopics,
    numberOfModules,
    approach,
    userId: user.id,
  };

  const response = await generateModulesUseCase(request, courseRepository);

  res.status(200).json(response);
}

/**
 * Create multiple modules for a course
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleCreateModulesBulk(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { courseId } = req.params;
  const { modules } = req.body;

  if (!courseId) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  const request: CreateModulesBulkRequest = {
    courseId,
    modules,
    userId: user.id,
  };

  const response = await createModulesBulkUseCase(
    request,
    moduleRepository,
    courseRepository
  );

  res.status(201).json(response);
}
