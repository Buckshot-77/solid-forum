import { Either, left, right } from '@/core/either'

import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
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
    const foundQuestionComment =
      await this.questionCommentRepository.findById(questionCommentId)

    if (!foundQuestionComment)
      return left(
        new ResourceNotFoundError('No question was found with the given ID'),
      )

    if (foundQuestionComment.authorId !== authorId)
      return left(
        new NotAllowedError('User not allowed to delete this comment'),
      )

    await this.questionCommentRepository.deleteById(questionCommentId)

    return right({})
  }
}
