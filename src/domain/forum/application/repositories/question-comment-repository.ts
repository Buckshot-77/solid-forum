import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  findById(id: string): Promise<QuestionComment | undefined>
  create(questionComment: QuestionComment): Promise<void>
}
