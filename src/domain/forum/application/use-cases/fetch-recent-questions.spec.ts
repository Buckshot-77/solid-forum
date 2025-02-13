import { expect, describe, it, beforeEach } from 'vitest'

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { PaginationError } from './errors/pagination-error'

describe('FetchRecentQuestions unit tests', () => {
  let fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    fetchRecentQuestionsUseCase = new FetchRecentQuestionsUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should return PaginationError if pageSize exceeds max page size allowed', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 1,
      pageSize: 31,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new PaginationError('Page size not allowed! Max page size is 30'),
    )
  })

  it('should order results by createdAt date', async () => {
    const firstQuestion = makeQuestion({
      createdAt: new Date('2020-01-01'),
    })
    const secondQuestion = makeQuestion({
      createdAt: new Date('2021-01-01'),
    })
    const thirdQuestion = makeQuestion({
      createdAt: new Date('2022-01-01'),
    })

    await inMemoryQuestionRepository.create(firstQuestion)
    await inMemoryQuestionRepository.create(secondQuestion)
    await inMemoryQuestionRepository.create(thirdQuestion)

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 1,
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questions).toEqual([
      thirdQuestion,
      secondQuestion,
      firstQuestion,
    ])
    expect(result.isRight()).toBe(true)
  })

  it('should return the first 30 results if no pageSize is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestion()
      await inMemoryQuestionRepository.create(createdQuestion)
    }

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 1,
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questions.length).toBe(30)
    expect(result.isRight()).toBe(true)
  })

  it('should return 20 results for 50 questions created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestion()
      await inMemoryQuestionRepository.create(createdQuestion)
    }

    const result = await fetchRecentQuestionsUseCase.execute({ page: 2 })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questions.length).toBe(20)
    expect(result.isRight()).toBe(true)
  })
})
