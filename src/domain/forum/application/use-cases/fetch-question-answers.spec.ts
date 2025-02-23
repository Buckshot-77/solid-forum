import { expect, describe, it, beforeEach } from 'vitest'

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { PaginationError } from './errors/pagination-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

describe('FetchQuestionAnswers unit tests', () => {
  let fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    fetchQuestionAnswersUseCase = new FetchQuestionAnswersUseCase(
      inMemoryAnswersRepository,
    )
  })

  it('should return PaginationError if pageSize exceeds max page size allowed', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswersRepository.create(createdAnswer)

    const result = await fetchQuestionAnswersUseCase.execute({
      page: 1,
      pageSize: 31,
      questionId: 'any-question-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new PaginationError('Page size not allowed! Max page size is 30'),
    )
  })

  it('should return the first 30 results if no pageSize is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryAnswersRepository.create(createdAnswer)
    }

    const result = await fetchQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answers.length).toBe(30)
    expect(result.isRight()).toBe(true)
  })

  it('should only fetch the answers from the given question', async () => {
    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryAnswersRepository.create(createdAnswer)
    }

    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('other-question-id'),
      })
      await inMemoryAnswersRepository.create(createdAnswer)
    }

    const result = await fetchQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answers.length).toBe(10)
    expect(result.isRight()).toBe(true)
  })

  it('should order results by createdAt date', async () => {
    const firstAnswer = makeAnswer({
      createdAt: new Date('2020-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })
    const secondAnswer = makeAnswer({
      createdAt: new Date('2021-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })
    const thirdAnswer = makeAnswer({
      createdAt: new Date('2022-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })

    await inMemoryAnswersRepository.create(firstAnswer)
    await inMemoryAnswersRepository.create(secondAnswer)
    await inMemoryAnswersRepository.create(thirdAnswer)

    const result = await fetchQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answers).toEqual([
      thirdAnswer,
      secondAnswer,
      firstAnswer,
    ])
    expect(result.isRight()).toBe(true)
  })

  it('should return 20 results for 50 answers created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryAnswersRepository.create(createdAnswer)
    }

    const result = await fetchQuestionAnswersUseCase.execute({
      page: 2,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answers.length).toBe(20)
    expect(result.isRight()).toBe(true)
  })
})
