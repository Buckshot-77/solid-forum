import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Answer } from '@/domain/entities/answer'
import { AnswerRepository } from '@/domain/repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}
  async execute({
    content,
    authorId,
    questionId,
  }: AnswerQuestionUseCaseRequest): Promise<Answer> {
    const answer = Answer.create({
      content,
      authorId: new UniqueIdentifier(authorId),
      questionId: new UniqueIdentifier(questionId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.answerRepository.create(answer)

    return answer
  }
}
