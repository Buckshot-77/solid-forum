import { expect, describe, it, beforeEach, vi } from 'vitest'

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('GetQuestionBySlug unit tests', () => {
  let getQuestionBySlugUseCase: GetQuestionBySlugUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(
      inMemoryQuestionRepository,
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
    const getBySlugSpy = vi.spyOn(inMemoryQuestionRepository, 'findBySlug')
    const createdQuestion = makeQuestion({
      slug: Slug.createWithoutTreatments('any-slug-text'),
    })

    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await getQuestionBySlugUseCase.execute({
      slug_text: 'any-slug-text',
    })

    expect(getBySlugSpy).toHaveBeenCalledWith('any-slug-text')

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.question.slug).toBe('any-slug-text')
  })
})
