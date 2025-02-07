import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  pageSize?: number
  questionId: string
}

interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[]
}

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  private readonly MAX_PAGE_SIZE = 30

  public async execute({
    page,
    pageSize,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_PAGE_SIZE)
      throw new Error(
        `Page size not allowed! Max page size is ${this.MAX_PAGE_SIZE}`,
      )
    const foundAnswers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page, pageSize: pageSize ?? this.MAX_PAGE_SIZE },
    )

    return { answers: foundAnswers }
  }
}
