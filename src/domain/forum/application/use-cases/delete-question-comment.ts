import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: UniqueIdentifier
  authorId: UniqueIdentifier
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteQuestionCommentUseCaseResponse {}

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
      throw new Error('No question was found with the given ID')

    if (foundQuestionComment.authorId !== authorId.toString())
      throw new Error('User not allowed to delete this comment')

    await this.questionCommentRepository.deleteById(
      questionCommentId.toString(),
    )

    return {}
  }
}
