import { expect, describe, it, beforeEach, vi } from 'vitest'

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

describe('GetQuestionBySlug unit tests', () => {
  let getQuestionBySlugUseCase: GetQuestionBySlugUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should return ResourceNotFoundError if question is not found', async () => {
    const result = await getQuestionBySlugUseCase.execute({
      slug_text: 'any-slug',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Question not found'),
    )
  })

  it('should be able to get question by slug and call find by slug with the given slug', async () => {
    const getBySlugSpy = vi.spyOn(inMemoryQuestionsRepository, 'findBySlug')
    const createdQuestion = makeQuestion({
      slug: Slug.createWithoutTreatments('any-slug-text'),
    })

    await inMemoryQuestionsRepository.create(createdQuestion)

    const result = await getQuestionBySlugUseCase.execute({
      slug_text: 'any-slug-text',
    })

    expect(getBySlugSpy).toHaveBeenCalledWith('any-slug-text')

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.question.slug).toBe('any-slug-text')
  })
})
