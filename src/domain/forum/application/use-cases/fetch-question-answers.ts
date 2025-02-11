import { Either, left, right } from '@/core/either'

import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { PaginationError } from './errors/pagination-error'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  pageSize?: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  PaginationError,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      return left(
        new PaginationError(
          `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
        ),
      )
    const foundAnswers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page, pageSize: pageSize ?? this.MAX_PAGE_SIZE },
    )

    return right({ answers: foundAnswers })
  }
}
