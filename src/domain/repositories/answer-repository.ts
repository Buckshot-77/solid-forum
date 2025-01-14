import { Answer } from '@/domain/entities/answer'

export interface AnswerRepository {
  create(answer: Answer): Promise<void>
}
