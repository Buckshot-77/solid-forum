import { expect, describe, it, beforeEach, vi } from 'vitest'

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'

describe('GetQuestionBySlug unit tests', () => {
  let getQuestionBySlugUseCase: GetQuestionBySlugUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should be able to get question by slug and call find by slug with the given slug', async () => {
    const getBySlugSpy = vi.spyOn(inMemoryQuestionRepository, 'findBySlug')
    const createdQuestion = makeQuestion({
      slug: Slug.createWithoutTreatments('any-slug-text'),
    })

    await inMemoryQuestionRepository.create(createdQuestion)

    const { question } = await getQuestionBySlugUseCase.execute({
      slug_text: 'any-slug-text',
    })

    expect(getBySlugSpy).toHaveBeenCalledWith('any-slug-text')
    expect(question.slug).toBe('any-slug-text')
  })
})
