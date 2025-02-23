import { expect, describe, it, beforeEach } from 'vitest'

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { PaginationError } from './errors/pagination-error'

describe('FetchAnswerComments unit tests', () => {
  let fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should return PaginationError if pageSize exceeds max page size allowed', async () => {
    const createdAnswer = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(createdAnswer)

    const result = await fetchAnswerCommentsUseCase.execute({
      page: 1,
      pageSize: 31,
      answerId: 'any-answer-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new PaginationError('Page size not allowed! Max page size is 30'),
    )
  })

  it('should return the first 30 results if no pageSize is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('any-answer-id'),
      })
      await inMemoryAnswerCommentsRepository.create(createdAnswer)
    }

    const result = await fetchAnswerCommentsUseCase.execute({
      page: 1,
      answerId: 'any-answer-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value?.answerComments.length).toBe(30)
    expect(result.isRight()).toBe(true)
  })

  it('should only fetch the answer comments from the given question', async () => {
    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('any-answer-id'),
      })
      await inMemoryAnswerCommentsRepository.create(createdAnswer)
    }

    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('other-answer-id'),
      })
      await inMemoryAnswerCommentsRepository.create(createdAnswer)
    }

    const result = await fetchAnswerCommentsUseCase.execute({
      page: 1,
      answerId: 'any-answer-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answerComments.length).toBe(10)
    expect(result.isRight()).toBe(true)
  })

  it('should order results by createdAt date', async () => {
    const firstAnswerComment = makeAnswerComment({
      createdAt: new Date('2020-01-01'),
      answerId: new UniqueIdentifier('any-answer-id'),
    })
    const secondAnswerComment = makeAnswerComment({
      createdAt: new Date('2021-01-01'),
      answerId: new UniqueIdentifier('any-answer-id'),
    })
    const thirdAnswerComment = makeAnswerComment({
      createdAt: new Date('2022-01-01'),
      answerId: new UniqueIdentifier('any-answer-id'),
    })

    await inMemoryAnswerCommentsRepository.create(firstAnswerComment)
    await inMemoryAnswerCommentsRepository.create(secondAnswerComment)
    await inMemoryAnswerCommentsRepository.create(thirdAnswerComment)

    const result = await fetchAnswerCommentsUseCase.execute({
      page: 1,
      answerId: 'any-answer-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answerComments).toEqual([
      thirdAnswerComment,
      secondAnswerComment,
      firstAnswerComment,
    ])
    expect(result.isRight()).toBe(true)
  })

  it('should return 20 results for 50 answer comments created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('any-answer-id'),
      })
      await inMemoryAnswerCommentsRepository.create(createdAnswer)
    }

    const result = await fetchAnswerCommentsUseCase.execute({
      page: 2,
      answerId: 'any-answer-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.answerComments.length).toBe(20)
    expect(result.isRight()).toBe(true)
  })
})
