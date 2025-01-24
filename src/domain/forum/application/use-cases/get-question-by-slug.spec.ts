import { expect, describe, it, beforeEach } from 'vitest'

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'

describe('GetQuestionBySlug unit tests', () => {
  let getQuestionBySlugUseCase: GetQuestionBySlugUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should be able to get question by slug', async () => {
    await inMemoryQuestionRepository.create(
      Question.create({
        authorId: new UniqueIdentifier(),
        content: 'any-content',
        title: 'any-title',
        slug: Slug.createWithoutTreatments('any-slug-text'),
      }),
    )

    const { question } = await getQuestionBySlugUseCase.execute({
      slug_text: 'any-slug-text',
    })

    expect(question.slug).toBe('any-slug-text')
  })
})
