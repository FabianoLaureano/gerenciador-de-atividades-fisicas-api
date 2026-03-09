import { ITrainingLogRepository } from "../interfaces/training-log-repository-interface.js";
import { TrainingLog } from "../../models/training-log.model.js";

export class InMemoryTrainingLogRepository implements ITrainingLogRepository {
  public items: TrainingLog[] = [];

  async create(trainingLog: TrainingLog): Promise<void> {
    this.items.push(trainingLog);
  }

  async findManyByUserId(userId: string): Promise<TrainingLog[]> {
    return this.items
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<TrainingLog | null> {
    return this.items.find((log) => log.id === id) ?? null;
  }
}
