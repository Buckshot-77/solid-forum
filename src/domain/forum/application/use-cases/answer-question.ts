import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface AnswerQuestionUseCaseResponse {
  answer_id: string
  question_id: string
  author_id: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}
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

    return {
      answer_id: answer.id,
      question_id: answer.questionId.toString(),
      author_id: answer.authorId.toString(),
      content: answer.content,
    }
  }
}
