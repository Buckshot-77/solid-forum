import { Either, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
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

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
