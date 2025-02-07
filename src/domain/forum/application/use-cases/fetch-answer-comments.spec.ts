import { expect, describe, it, beforeEach } from 'vitest'

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

describe('FetchAnswerComments unit tests', () => {
  let fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase
  let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository

  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentRepository,
    )
  })

  it('should throw an error if pageSize exceeds max page size allowed', async () => {
    const createdAnswer = makeAnswerComment()
    await inMemoryAnswerCommentRepository.create(createdAnswer)

    await expect(
      fetchAnswerCommentsUseCase.execute({
        page: 1,
        pageSize: 31,
        answerId: 'any-answer-id',
      }),
    ).rejects.toThrowError('Page size not allowed! Max page size is 30')
  })

  it('should return the first 30 results if no pageSize is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('any-answer-id'),
      })
      await inMemoryAnswerCommentRepository.create(createdAnswer)
    }

    const { answerComments: foundAnswerComments } =
      await fetchAnswerCommentsUseCase.execute({
        page: 1,
        answerId: 'any-answer-id',
      })

    expect(foundAnswerComments.length).toBe(30)
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

    const { answerComments: foundAnswerComments } =
      await fetchAnswerCommentsUseCase.execute({
        page: 1,
        answerId: 'any-answer-id',
      })

    expect(foundAnswerComments.length).toBe(10)
  })

  it('should order results by createdAt date', async () => {
    const firstAnswer = makeAnswerComment({
      createdAt: new Date('2020-01-01'),
      answerId: new UniqueIdentifier('any-answer-id'),
    })
    const secondAnswer = makeAnswerComment({
      createdAt: new Date('2021-01-01'),
      answerId: new UniqueIdentifier('any-answer-id'),
    })
    const thirdAnswer = makeAnswerComment({
      createdAt: new Date('2022-01-01'),
      answerId: new UniqueIdentifier('any-answer-id'),
    })

    await inMemoryAnswerCommentRepository.create(firstAnswer)
    await inMemoryAnswerCommentRepository.create(secondAnswer)
    await inMemoryAnswerCommentRepository.create(thirdAnswer)

    const { answerComments } = await fetchAnswerCommentsUseCase.execute({
      page: 1,
      answerId: 'any-answer-id',
    })

    expect(answerComments).toEqual([thirdAnswer, secondAnswer, firstAnswer])
  })

  it('should return 20 results for 50 answer comments created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueIdentifier('any-answer-id'),
      })
      await inMemoryAnswerCommentRepository.create(createdAnswer)
    }

    const { answerComments: foundAnswerComments } =
      await fetchAnswerCommentsUseCase.execute({
        page: 2,
        answerId: 'any-answer-id',
      })

    expect(foundAnswerComments.length).toBe(20)
  })
})
