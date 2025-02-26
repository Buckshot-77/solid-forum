import { Either, left, right } from '@/core/types/either'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
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
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  public async execute({
    slug_text,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const foundQuestion = await this.questionsRepository.findBySlug(slug_text)

    if (!foundQuestion)
      return left(new ResourceNotFoundError('Question not found'))

    return right({ question: foundQuestion })
  }
}
