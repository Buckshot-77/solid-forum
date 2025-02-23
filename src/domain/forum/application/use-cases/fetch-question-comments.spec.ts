import { expect, describe, it, beforeEach } from 'vitest'

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'

import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { PaginationError } from './errors/pagination-error'

describe('FetchQuestionComments unit tests', () => {
  let fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should return PaginationError if pageSize exceeds max page size allowed', async () => {
    const createdQuestion = makeQuestionComment()
    await inMemoryQuestionCommentsRepository.create(createdQuestion)

    const result = await fetchQuestionCommentsUseCase.execute({
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
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryQuestionCommentsRepository.create(createdQuestion)
    }

    const result = await fetchQuestionCommentsUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questionComments.length).toBe(30)
    expect(result.isRight()).toBe(true)
  })

  it('should only fetch the question comments from the given question', async () => {
    for (let i = 0; i < 10; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryQuestionCommentsRepository.create(createdQuestion)
    }

    for (let i = 0; i < 10; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('other-question-id'),
      })
      await inMemoryQuestionCommentsRepository.create(createdQuestion)
    }

    const result = await fetchQuestionCommentsUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questionComments.length).toBe(10)
    expect(result.isRight()).toBe(true)
  })

  it('should order results by createdAt date', async () => {
    const firstQuestionComment = makeQuestionComment({
      createdAt: new Date('2020-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })
    const secondQuestionComment = makeQuestionComment({
      createdAt: new Date('2021-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })
    const thirdQuestionComment = makeQuestionComment({
      createdAt: new Date('2022-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })

    await inMemoryQuestionCommentsRepository.create(firstQuestionComment)
    await inMemoryQuestionCommentsRepository.create(secondQuestionComment)
    await inMemoryQuestionCommentsRepository.create(thirdQuestionComment)

    const result = await fetchQuestionCommentsUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questionComments).toEqual([
      thirdQuestionComment,
      secondQuestionComment,
      firstQuestionComment,
    ])
    expect(result.isRight()).toBe(true)
  })

  it('should return 20 results for 50 question comments created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryQuestionCommentsRepository.create(createdQuestion)
    }

    const result = await fetchQuestionCommentsUseCase.execute({
      page: 2,
      questionId: 'any-question-id',
    })

    // @ts-expect-error TS doesn't know the type due to a lack of an if statement. This is expected, and the workaround is necessary for the test
    expect(result.value.questionComments.length).toBe(20)
    expect(result.isRight()).toBe(true)
  })
})
