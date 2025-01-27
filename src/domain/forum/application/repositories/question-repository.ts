import { Question } from '@/domain/forum/enterprise/entities/question'

export interface QuestionRepository {
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  deleteById(id: string): Promise<void>
  findById(id: string): Promise<Question | undefined>
  findBySlug(slug_text: string): Promise<Question | undefined>
}
