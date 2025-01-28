import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
  pageSize?: number
}

interface FetchRecentQuestionsUseCaseResponse {
  questions: Question[]
}

export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  private readonly MAX_pageSize = 30

  public async execute({
    page,
    pageSize,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    if (pageSize && pageSize > this.MAX_pageSize)
      throw new Error(
        `Page size not allowed! Max page size is ${this.MAX_pageSize}`,
      )
    const foundQuestions = await this.questionRepository.findManyRecent({
      page,
      pageSize: pageSize ?? this.MAX_pageSize,
    })

    return { questions: foundQuestions }
  }
}
