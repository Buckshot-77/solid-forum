import { expect, describe, it, beforeEach } from 'vitest'

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'

import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

describe('FetchQuestionAnswers unit tests', () => {
  let fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository

  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    fetchQuestionAnswersUseCase = new FetchQuestionAnswersUseCase(
      inMemoryAnswerRepository,
    )
  })

  it('should throw an error if pageSize exceeds max page size allowed', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    await expect(
      fetchQuestionAnswersUseCase.execute({
        page: 1,
        pageSize: 31,
        questionId: 'any-question-id',
      }),
    ).rejects.toThrowError('Page size not allowed! Max page size is 30')
  })

  it('should return the first 30 results if no pageSize is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryAnswerRepository.create(createdAnswer)
    }

    const { answers: foundAnswers } = await fetchQuestionAnswersUseCase.execute(
      {
        page: 1,
        questionId: 'any-question-id',
      },
    )

    expect(foundAnswers.length).toBe(30)
  })

  it('should only fetch the answers from the given question', async () => {
    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryAnswerRepository.create(createdAnswer)
    }

    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('other-question-id'),
      })
      await inMemoryAnswerRepository.create(createdAnswer)
    }

    const { answers: foundAnswers } = await fetchQuestionAnswersUseCase.execute(
      {
        page: 1,
        questionId: 'any-question-id',
      },
    )

    expect(foundAnswers.length).toBe(10)
  })

  it('should return 20 results for 50 answers created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryAnswerRepository.create(createdAnswer)
    }

    const { answers: foundAnswers } = await fetchQuestionAnswersUseCase.execute(
      { page: 2, questionId: 'any-question-id' },
    )

    expect(foundAnswers.length).toBe(20)
  })
})
