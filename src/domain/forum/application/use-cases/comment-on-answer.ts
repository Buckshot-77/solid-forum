import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'

interface CommentOnAnswerUseCaseRequest {
  content: string
  authorId: UniqueIdentifier
  answerId: UniqueIdentifier
}

interface CommentOnAnswerUseCaseResponse {
  answerComment: AnswerComment
}

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}
  async execute({
    authorId,
    content,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const foundAnswer = await this.answerRepository.findById(
      answerId.toString(),
    )
    if (!foundAnswer) throw new Error('Answer not found')

    const answerComment = AnswerComment.create({
      content,
      answerId,
      authorId: authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.answerCommentRepository.create(answerComment)

    return { answerComment }
  }
}
