import { Either, left, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

export interface ChooseBestAnswerUseCaseRequest {
  answerId: string
  questionAuthorId: string
}

type ChooseBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    questionId: string
    bestAnswerId: string
  }
>

export class ChooseBestAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  public async execute({
    answerId,
    questionAuthorId,
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const foundAnswer = await this.answerRepository.findById(answerId)
    if (!foundAnswer) {
      return left(new ResourceNotFoundError('Answer was not found'))
    }

    const foundQuestion = await this.questionRepository.findById(
      foundAnswer.questionId,
    )

    if (!foundQuestion) {
      return left(new ResourceNotFoundError('Question was not found'))
    }
    if (foundQuestion.authorId !== questionAuthorId) {
      return left(new NotAllowedError('Question is not from this author'))
    }

    foundQuestion.bestAnswerId = new UniqueIdentifier(foundAnswer.id)

    await this.questionRepository.save(foundQuestion)

    return right({ bestAnswerId: foundAnswer.id, questionId: foundQuestion.id })
  }
}
