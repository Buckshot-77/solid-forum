import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface AnswerRepository {
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | undefined>
  findByQuestionId(questionId: string): Promise<Answer[]>
  deleteById(id: string): Promise<void>
}
