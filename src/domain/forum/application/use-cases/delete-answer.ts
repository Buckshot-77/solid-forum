import { Either, left, right } from '@/core/types/either'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const foundAnswer = await this.answersRepository.findById(answerId)

    if (!foundAnswer)
      return left(
        new ResourceNotFoundError('No answer was found with the given ID'),
      )

    if (foundAnswer.authorId !== authorId)
      return left(new NotAllowedError('User not allowed to delete this answer'))

    await this.answersRepository.deleteById(answerId)

    return right({})
  }
}
