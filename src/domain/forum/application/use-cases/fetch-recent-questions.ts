import { Either, left, right } from '@/core/either'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
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
  constructor(private readonly questionRepository: QuestionRepository) {}
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
    const foundQuestions = await this.questionRepository.findManyRecent({
      page,
      pageSize: pageSize ?? this.MAX_PAGE_SIZE,
    })

    return right({ questions: foundQuestions })
  }
}
