import { expect, describe, it, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'

describe('CreateQuestion unit tests', () => {
  let createQuestionUseCase: CreateQuestionUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    createQuestionUseCase = new CreateQuestionUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should be able to create a question', async () => {
    const response = await createQuestionUseCase.execute({
      authorId: 'any author id',
      content: 'any content',
      title: 'any title',
    })

    expect(response).toEqual({
      authorId: 'any author id',
      content: 'any content',
      slug: 'any-title',
      questionId: expect.any(String),
      title: 'any title',
    })
  })
})
