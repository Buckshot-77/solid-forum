import { PaginationParams } from '@/core/repository/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findManyByQuestionId(
    questionId: string,
    paginationParams: PaginationParams,
  ): Promise<Answer[]>
  findById(id: string): Promise<Answer | undefined>
  findByQuestionId(questionId: string): Promise<Answer[]>
  deleteById(id: string): Promise<void>
}
