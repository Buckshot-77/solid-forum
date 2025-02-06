import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export interface AnswerCommentRepository {
  findById(id: string): Promise<AnswerComment | undefined>
  create(answerComment: AnswerComment): Promise<void>
  deleteById(id: string): Promise<void>
}
