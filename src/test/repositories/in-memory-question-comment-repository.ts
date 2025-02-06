import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  private questionComments: QuestionComment[] = []

  public async findById(id: string): Promise<QuestionComment | undefined> {
    const foundQuestionComment = this.questionComments.find(
      (questionComment) => questionComment.id === id,
    )

    return foundQuestionComment
  }
  public async create(questionComment: QuestionComment): Promise<void> {
    this.questionComments.push(questionComment)
  }
}
