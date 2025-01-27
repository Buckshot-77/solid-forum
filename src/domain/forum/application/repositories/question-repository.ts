import { Question } from '@/domain/forum/enterprise/entities/question'

export interface EditQuestionRepositoryRequest {
  newContent: string
  question: Question
}

export interface QuestionRepository {
  create(question: Question): Promise<void>
  edit(request: EditQuestionRepositoryRequest): Promise<Question>
  deleteById(id: string): Promise<void>
  findById(id: string): Promise<Question | undefined>
  findBySlug(slug_text: string): Promise<Question | undefined>
}
