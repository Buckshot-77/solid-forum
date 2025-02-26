import { Either, left, right } from '@/core/types/either'

import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationError } from './errors/pagination-error'

interface FetchQuestionCommentsUseCaseRequest {
  page: number
  pageSize?: number
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  PaginationError,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      return left(
        new PaginationError(
          `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
        ),
      )
    const foundQuestionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        pageSize: pageSize ?? this.MAX_PAGE_SIZE,
      })

    return right({ questionComments: foundQuestionComments })
  }
}
