import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: UniqueIdentifier
  authorId: UniqueIdentifier
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}
  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const foundAnswerComment = await this.answerCommentRepository.findById(
      answerCommentId.toString(),
    )

    if (!foundAnswerComment)
      throw new Error('No answer was found with the given ID')

    if (foundAnswerComment.authorId !== authorId.toString())
      throw new Error('User not allowed to delete this comment')

    await this.answerCommentRepository.deleteById(answerCommentId.toString())

    return {}
  }
}
