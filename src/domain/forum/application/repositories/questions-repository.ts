import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repository/pagination-params'

export interface QuestionsRepository {
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  deleteById(id: string): Promise<void>
  findManyRecent({ page, pageSize }: PaginationParams): Promise<Question[]>
  findById(id: string): Promise<Question | undefined>
  findBySlug(slug_text: string): Promise<Question | undefined>
}
