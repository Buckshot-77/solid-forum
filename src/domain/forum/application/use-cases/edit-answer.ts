import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface EditAnswerRequest {
  answerId: string
  authorId: string
  newContent: string
}

export interface EditAnswerResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  public async execute({
    authorId,
    newContent,
    answerId,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const foundAnswer = await this.answerRepository.findById(answerId)

    if (!foundAnswer) throw new Error('Answer was not found')
    if (foundAnswer.authorId !== authorId)
      throw new Error('Answer is not from this author')

    foundAnswer.content = newContent

    await this.answerRepository.save(foundAnswer)

    return { answer: foundAnswer }
  }
}
