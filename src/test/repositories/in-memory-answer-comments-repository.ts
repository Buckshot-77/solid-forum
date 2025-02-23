import { PaginationParams } from '@/core/repository/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  public async findById(id: string): Promise<AnswerComment | undefined> {
    const foundAnswerComment = this.answerComments.find(
      (answerComment) => answerComment.id === id,
    )

    return foundAnswerComment
  }

  public async findManyByAnswerId(
    answerId: string,
    { page, pageSize }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const foundAnswers = this.answerComments
      .filter((answerComment) => answerComment.answerId === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)

    return foundAnswers
  }

  public async create(answerComment: AnswerComment): Promise<void> {
    this.answerComments.push(answerComment)
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.answerComments.findIndex(
      (answerComment) => answerComment.id === id,
    )

    if (foundIndex === -1) {
      return
    }

    this.answerComments.splice(foundIndex, 1)
  }
}
