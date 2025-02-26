import { Either, left, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentOnQuestionUseCaseRequest {
  content: string
  authorId: string
  questionId: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}
  async execute({
    authorId,
    content,
    questionId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const foundQuestion = await this.questionsRepository.findById(
      questionId.toString(),
    )
    if (!foundQuestion)
      return left(new ResourceNotFoundError('Question not found'))

    const questionComment = QuestionComment.create({
      content,
      questionId: new UniqueIdentifier(questionId),
      authorId: new UniqueIdentifier(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
