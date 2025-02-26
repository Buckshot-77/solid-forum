import { Either, left, right } from '@/core/types/either'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

import { PaginationError } from './errors/pagination-error'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
  pageSize?: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  PaginationError,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      return left(
        new PaginationError(
          `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
        ),
      )
    const foundQuestions = await this.questionsRepository.findManyRecent({
      page,
      pageSize: pageSize ?? this.MAX_PAGE_SIZE,
    })

    return right({ questions: foundQuestions })
  }
}
