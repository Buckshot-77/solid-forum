import { Either, left, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentOnAnswerUseCaseRequest {
  content: string
  authorId: string
  answerId: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>

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
    if (!foundAnswer) return left(new ResourceNotFoundError('Answer not found'))

    const answerComment = AnswerComment.create({
      content,
      answerId: new UniqueIdentifier(answerId),
      authorId: new UniqueIdentifier(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.answerCommentRepository.create(answerComment)

    return right({ answerComment })
  }
}
