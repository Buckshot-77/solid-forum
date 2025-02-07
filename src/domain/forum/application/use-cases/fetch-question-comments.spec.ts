import { expect, describe, it, beforeEach } from 'vitest'

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'

import { InMemoryQuestionCommentRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

describe('FetchQuestionComments unit tests', () => {
  let fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase
  let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository

  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(
      inMemoryQuestionCommentRepository,
    )
  })

  it('should throw an error if pageSize exceeds max page size allowed', async () => {
    const createdQuestion = makeQuestionComment()
    await inMemoryQuestionCommentRepository.create(createdQuestion)

    await expect(
      fetchQuestionCommentsUseCase.execute({
        page: 1,
        pageSize: 31,
        questionId: 'any-question-id',
      }),
    ).rejects.toThrowError('Page size not allowed! Max page size is 30')
  })

  it('should return the first 30 results if no pageSize is given', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryQuestionCommentRepository.create(createdQuestion)
    }

    const { questionComments: foundQuestionComments } =
      await fetchQuestionCommentsUseCase.execute({
        page: 1,
        questionId: 'any-question-id',
      })

    expect(foundQuestionComments.length).toBe(30)
  })

  it('should only fetch the question comments from the given question', async () => {
    for (let i = 0; i < 10; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryQuestionCommentRepository.create(createdQuestion)
    }

    for (let i = 0; i < 10; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('other-question-id'),
      })
      await inMemoryQuestionCommentRepository.create(createdQuestion)
    }

    const { questionComments: foundQuestionComments } =
      await fetchQuestionCommentsUseCase.execute({
        page: 1,
        questionId: 'any-question-id',
      })

    expect(foundQuestionComments.length).toBe(10)
  })

  it('should order results by createdAt date', async () => {
    const firstQuestion = makeQuestionComment({
      createdAt: new Date('2020-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })
    const secondQuestion = makeQuestionComment({
      createdAt: new Date('2021-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })
    const thirdQuestion = makeQuestionComment({
      createdAt: new Date('2022-01-01'),
      questionId: new UniqueIdentifier('any-question-id'),
    })

    await inMemoryQuestionCommentRepository.create(firstQuestion)
    await inMemoryQuestionCommentRepository.create(secondQuestion)
    await inMemoryQuestionCommentRepository.create(thirdQuestion)

    const { questionComments } = await fetchQuestionCommentsUseCase.execute({
      page: 1,
      questionId: 'any-question-id',
    })

    expect(questionComments).toEqual([
      thirdQuestion,
      secondQuestion,
      firstQuestion,
    ])
  })

  it('should return 20 results for 50 question comments created and page 2 requested, for page size 30', async () => {
    for (let i = 0; i < 50; i++) {
      const createdQuestion = makeQuestionComment({
        questionId: new UniqueIdentifier('any-question-id'),
      })
      await inMemoryQuestionCommentRepository.create(createdQuestion)
    }

    const { questionComments: foundQuestionComments } =
      await fetchQuestionCommentsUseCase.execute({
        page: 2,
        questionId: 'any-question-id',
      })

    expect(foundQuestionComments.length).toBe(20)
  })
})
