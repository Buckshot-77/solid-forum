import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'

interface CommentOnQuestionUseCaseRequest {
  content: string
  authorId: UniqueIdentifier
  questionId: UniqueIdentifier
}

interface CommentOnQuestionUseCaseResponse {
  questionComment: QuestionComment
}

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}
  async execute({
    authorId,
    content,
    questionId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const foundQuestion = await this.questionRepository.findById(
      questionId.toString(),
    )
    if (!foundQuestion) throw new Error('Question not found')

    const questionComment = QuestionComment.create({
      content,
      questionId,
      authorId: authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.questionCommentRepository.create(questionComment)

    return { questionComment }
  }
}
