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
    const answer = new Answer({ content, authorId, questionId })

    await this.answerRepository.create(answer)

    return answer
  }
}
