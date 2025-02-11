import { Either, left, right } from '@/core/either'

import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

export interface EditAnswerRequest {
  answerId: string
  authorId: string
  newContent: string
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  public async execute({
    authorId,
    newContent,
    answerId,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const foundAnswer = await this.answerRepository.findById(answerId)

    if (!foundAnswer)
      return left(new ResourceNotFoundError('Answer was not found'))
    if (foundAnswer.authorId !== authorId)
      return left(new NotAllowedError('Answer is not from this author'))

    foundAnswer.content = newContent

    await this.answerRepository.save(foundAnswer)

    return right({ answer: foundAnswer })
  }
}
