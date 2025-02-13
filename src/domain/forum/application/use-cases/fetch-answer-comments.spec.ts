import { expect, describe, it, beforeEach } from 'vitest'

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { PaginationError } from './errors/pagination-error'

describe('FetchAnswerComments unit tests', () => {
  let fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase
  let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository

  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentRepository,
    )
  })

  it('should return PaginationError if pageSize exceeds max page size allowed', async () => {
    const createdAnswer = makeAnswerComment()
    await inMemoryAnswerCommentRepository.create(createdAnswer)

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
      await inMemoryAnswerCommentRepository.create(createdAnswer)
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
      await inMemoryAnswerCommentRepository.create(createdAnswer)
    }

    for (let i = 0; i < 10; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('other-answer-id'),
      })
      await inMemoryAnswerCommentRepository.create(createdAnswer)
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

    await inMemoryAnswerCommentRepository.create(firstAnswerComment)
    await inMemoryAnswerCommentRepository.create(secondAnswerComment)
    await inMemoryAnswerCommentRepository.create(thirdAnswerComment)

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
      await inMemoryAnswerCommentRepository.create(createdAnswer)
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
