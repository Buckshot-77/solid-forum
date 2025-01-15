import { Question } from '@/domain/forum/enterprise/entities/question'

export interface QuestionRepository {
  create(question: Question): Promise<void>
}
