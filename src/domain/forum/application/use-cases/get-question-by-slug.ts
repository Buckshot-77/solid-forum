import { Either, left, right } from '@/core/either'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetQuestionBySlugUseCaseRequest {
  slug_text: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  public async execute({
    slug_text,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const foundQuestion = await this.questionRepository.findBySlug(slug_text)

    if (!foundQuestion)
      return left(new ResourceNotFoundError('Question not found'))

    return right({ question: foundQuestion })
  }
}
