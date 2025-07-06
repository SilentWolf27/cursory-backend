import { prisma } from "../../config/prisma";

export abstract class BaseRepository<
  T,
  CreateInput = T,
  UpdateInput = Partial<T>
> {
  constructor(protected modelName: keyof typeof prisma) {}

  protected abstract mapToDomain(data: any): T;
  protected abstract mapToPrismaCreate(data: CreateInput): any;
  protected abstract mapToPrismaUpdate(data: UpdateInput): any;

  async create(data: CreateInput): Promise<T> {
    const model = prisma[this.modelName] as any;
    const created = await model.create({ data: this.mapToPrismaCreate(data) });
    return this.mapToDomain(created);
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    const model = prisma[this.modelName] as any;
    const updated = await model.update({
      where: { id },
      data: this.mapToPrismaUpdate(data),
    });
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      const model = prisma[this.modelName] as any;
      await model.update({ where: { id }, data: { deletedAt: new Date() } });
      return true;
    } catch {
      return false;
    }
  }

  async findById(id: string): Promise<T | null> {
    const model = prisma[this.modelName] as any;
    const found = await model.findFirst({ where: { id, deletedAt: null } });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<T[]> {
    const model = prisma[this.modelName] as any;
    const all = await model.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return all.map(this.mapToDomain.bind(this));
  }
}
