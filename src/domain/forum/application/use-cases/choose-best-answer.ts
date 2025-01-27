import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

export interface ChooseBestAnswerUseCaseRequest {
  answerId: string
  questionAuthorId: string
}

export interface ChooseBestAnswerUseCaseResponse {
  questionId: string
  bestAnswerId: string
}

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
    if (!foundAnswer) throw new Error('Answer was not found')

    const foundQuestion = await this.questionRepository.findById(
      foundAnswer.questionId,
    )
    if (!foundQuestion) throw new Error('Question was not found')
    if (foundQuestion.authorId !== questionAuthorId)
      throw new Error('Question is not from this author')

    foundQuestion.bestAnswerId = new UniqueIdentifier(foundAnswer.id)

    await this.questionRepository.save(foundQuestion)

    return { bestAnswerId: foundAnswer.id, questionId: foundQuestion.id }
  }
}
