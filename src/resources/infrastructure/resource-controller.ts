import { Request, Response } from "express";
import { resourceRepository } from "./resource-repository";
import { courseRepository } from "../../courses/infrastructure/course-repository";
import { createResourceUseCase } from "../application/create-resource-use-case";
import { updateResourceUseCase } from "../application/update-resource-use-case";
import { deleteResourceUseCase } from "../application/delete-resource-use-case";
import { User } from "../../auth/domain/user";
import { CreateResourceData, UpdateResourceData } from "../domain/resource";

export async function handleCreateResource(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { courseId } = req.params;
  const data = req.body as CreateResourceData;

  if (!courseId) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      error: "Course ID is required",
      statusCode: 400,
    });
    return;
  }

  const resource = await createResourceUseCase(
    resourceRepository,
    courseRepository,
    data,
    courseId,
    user.id
  );

  res.status(201).json(resource);
}

export async function handleUpdateResource(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { resourceId } = req.params;
  const data = req.body as UpdateResourceData;

  if (!resourceId) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      error: "Resource ID is required",
      statusCode: 400,
    });
    return;
  }

  const resource = await updateResourceUseCase(
    resourceRepository,
    courseRepository,
    resourceId,
    data,
    user.id
  );

  res.status(200).json(resource);
}

export async function handleDeleteResource(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { resourceId } = req.params;

  if (!resourceId) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      error: "Resource ID is required",
      statusCode: 400,
    });
    return;
  }

  await deleteResourceUseCase(
    resourceRepository,
    courseRepository,
    resourceId,
    user.id
  );

  res.status(204).send();
}
