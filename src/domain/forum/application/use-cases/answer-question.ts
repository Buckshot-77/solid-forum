import { Either, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}
  async execute({
    content,
    authorId,
    questionId,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueIdentifier(authorId),
      questionId: new UniqueIdentifier(questionId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
