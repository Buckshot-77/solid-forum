import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  private answerComments: AnswerComment[] = []

  public async findById(id: string): Promise<AnswerComment | undefined> {
    const foundAnswerComment = this.answerComments.find(
      (answerComment) => answerComment.id === id,
    )

    return foundAnswerComment
  }
  public async create(answerComment: AnswerComment): Promise<void> {
    this.answerComments.push(answerComment)
  }
}
