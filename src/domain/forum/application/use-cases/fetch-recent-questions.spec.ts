import { expect, describe, it, beforeEach } from 'vitest'

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'

describe('FetchRecentQuestions unit tests', () => {
  let fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    fetchRecentQuestionsUseCase = new FetchRecentQuestionsUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should throw an error if page_size exceeds max page size allowed', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    await expect(
      fetchRecentQuestionsUseCase.execute({ page: 1, page_size: 31 }),
    ).rejects.toThrowError('Page size not allowed! Max page size is 30')
  })

  it('should return the first 30 results if no page_size is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestion()
      await inMemoryQuestionRepository.create(createdQuestion)
    }

    const { questions: foundQuestions } =
      await fetchRecentQuestionsUseCase.execute({
        page: 1,
      })

    expect(foundQuestions.length).toBe(30)
  })

  it('should return 20 results for 50 questions created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestion()
      await inMemoryQuestionRepository.create(createdQuestion)
    }

    const { questions: foundQuestions } =
      await fetchRecentQuestionsUseCase.execute({ page: 2 })

    expect(foundQuestions.length).toBe(20)
  })
})
