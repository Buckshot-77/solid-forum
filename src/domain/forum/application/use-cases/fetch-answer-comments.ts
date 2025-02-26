import { Either, left, right } from '@/core/types/either'

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationError } from './errors/pagination-error'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  pageSize?: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  PaginationError,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      return left(
        new PaginationError(
          `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
        ),
      )
    const foundAnswerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
        pageSize: pageSize ?? this.MAX_PAGE_SIZE,
      })

    return right({ answerComments: foundAnswerComments })
  }
}
