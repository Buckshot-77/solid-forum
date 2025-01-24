import { Question } from '@/domain/forum/enterprise/entities/question'

export interface QuestionRepository {
  create(question: Question): Promise<void>
  findBySlug(slug_text: string): Promise<Question | undefined>
}
