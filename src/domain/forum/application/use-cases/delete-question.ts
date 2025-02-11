import { Either, left, right } from '@/core/either'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const foundQuestion = await this.questionRepository.findById(questionId)

    if (!foundQuestion)
      return left(
        new ResourceNotFoundError('No question was found with the given ID'),
      )

    if (foundQuestion.authorId !== authorId)
      return left(
        new NotAllowedError('User not allowed to delete this question'),
      )

    await this.questionRepository.deleteById(questionId)

    return right({})
  }
}
