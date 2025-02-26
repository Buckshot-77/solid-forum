import { Either, left, right } from '@/core/types/either'

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string
  authorId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}
  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const foundAnswerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!foundAnswerComment)
      return left(
        new ResourceNotFoundError('No answer was found with the given ID'),
      )

    if (foundAnswerComment.authorId !== authorId)
      return left(
        new NotAllowedError('User not allowed to delete this comment'),
      )

    await this.answerCommentsRepository.deleteById(answerCommentId)

    return right({})
  }
}
