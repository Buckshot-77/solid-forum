import { Either, left, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

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
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  public async execute({
    answerId,
    questionAuthorId,
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const foundAnswer = await this.answersRepository.findById(answerId)
    if (!foundAnswer) {
      return left(new ResourceNotFoundError('Answer was not found'))
    }

    const foundQuestion = await this.questionsRepository.findById(
      foundAnswer.questionId,
    )

    if (!foundQuestion) {
      return left(new ResourceNotFoundError('Question was not found'))
    }
    if (foundQuestion.authorId !== questionAuthorId) {
      return left(new NotAllowedError('Question is not from this author'))
    }

    foundQuestion.bestAnswerId = new UniqueIdentifier(foundAnswer.id)

    await this.questionsRepository.save(foundQuestion)

    return right({ bestAnswerId: foundAnswer.id, questionId: foundQuestion.id })
  }
}
