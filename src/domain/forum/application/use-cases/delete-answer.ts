import { Either, left, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  answerId: UniqueIdentifier
  authorId: UniqueIdentifier
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const foundAnswer = await this.answerRepository.findById(
      answerId.toString(),
    )

    if (!foundAnswer)
      return left(
        new ResourceNotFoundError('No answer was found with the given ID'),
      )

    if (foundAnswer.authorId !== authorId.toString())
      return left(new NotAllowedError('User not allowed to delete this answer'))

    await this.answerRepository.deleteById(answerId.toString())

    return right({})
  }
}
