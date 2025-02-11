import { Either, left, right } from '@/core/either'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

export interface EditQuestionRequest {
  questionId: string
  authorId: string
  newContent: string
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  public async execute({
    authorId,
    newContent,
    questionId,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const foundQuestion = await this.questionRepository.findById(questionId)

    if (!foundQuestion)
      return left(new ResourceNotFoundError('Question was not found'))
    if (foundQuestion.authorId !== authorId)
      return left(new NotAllowedError('Question is not from this author'))

    foundQuestion.content = newContent

    await this.questionRepository.save(foundQuestion)

    return right({ question: foundQuestion })
  }
}
