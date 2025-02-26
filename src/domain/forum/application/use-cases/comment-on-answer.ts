import { Either, left, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

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
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}
  async execute({
    authorId,
    content,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const foundAnswer = await this.answersRepository.findById(
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

    await this.answerCommentsRepository.create(answerComment)

    return right({ answerComment })
  }
}
