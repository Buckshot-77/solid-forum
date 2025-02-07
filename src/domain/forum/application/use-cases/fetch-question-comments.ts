import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

interface FetchQuestionCommentsUseCaseRequest {
  page: number
  pageSize?: number
  questionId: string
}

interface FetchQuestionCommentsUseCaseResponse {
  questionComments: QuestionComment[]
}

export class FetchQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      throw new Error(
        `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
      )
    const foundQuestionComments =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
        pageSize: pageSize ?? this.MAX_PAGE_SIZE,
      })

    return { questionComments: foundQuestionComments }
  }
}
