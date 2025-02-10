import { Either, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answerId: string
    questionId: string
    authorId: string
    content: string
  }
>

export class AnswerQuestionUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    content,
    authorId,
    questionId,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueIdentifier(questionId),
      questionId: new UniqueIdentifier(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.answerRepository.create(answer)

    return right({
      answerId: answer.id,
      questionId: answer.questionId.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
    })
  }
}
