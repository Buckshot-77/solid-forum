import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  pageSize?: number
  answerId: string
}

interface FetchAnswerCommentsUseCaseResponse {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor(
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      throw new Error(
        `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
      )
    const foundAnswerComments =
      await this.answerCommentRepository.findManyByAnswerId(answerId, {
        page,
        pageSize: pageSize ?? this.MAX_PAGE_SIZE,
      })

    return { answerComments: foundAnswerComments }
  }
}
