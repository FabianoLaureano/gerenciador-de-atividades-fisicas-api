import dayjs from "dayjs";
import { ITrainingLogRepository } from "../repositories/interfaces/training-log-repository-interface.js";
import { TrainingLog } from "../models/training-log.model.js";

interface InputDto {
  userId: string;
  name?: string;
  description?: string;
  type?: string;
}

interface OutputDto {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: string;
  createdAt: Date;
}

export class CreateTrainingLog {
  constructor(private readonly repository: ITrainingLogRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const name: string =
      (dto.name?.trim() || undefined) ??
      `Treino do dia ${dayjs().format("DD/MM/YYYY")}`;

    const trainingLog = TrainingLog.create({
      userId: dto.userId,
      name,
      description: dto.description,
      type: dto.type ?? "outro",
    });

    await this.repository.create(trainingLog);

    return {
      id: trainingLog.id,
      userId: trainingLog.userId,
      name,
      description: trainingLog.description,
      type: trainingLog.type,
      createdAt: trainingLog.createdAt,
    };
  }
}
