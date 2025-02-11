import { Either, left, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: UniqueIdentifier
  authorId: UniqueIdentifier
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}
  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const foundQuestionComment = await this.questionCommentRepository.findById(
      questionCommentId.toString(),
    )

    if (!foundQuestionComment)
      return left(
        new ResourceNotFoundError('No question was found with the given ID'),
      )

    if (foundQuestionComment.authorId !== authorId.toString())
      return left(
        new NotAllowedError('User not allowed to delete this comment'),
      )

    await this.questionCommentRepository.deleteById(
      questionCommentId.toString(),
    )

    return right({})
  }
}
