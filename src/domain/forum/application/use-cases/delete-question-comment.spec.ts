import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryQuestionCommentRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

describe('DeleteQuestionComment unit tests', () => {
  let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase
  let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository

  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentRepository,
    )
  })

  it('should be able to delete a question comment', async () => {
    const createdQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentRepository.create(createdQuestionComment)

    const foundQuestion = await inMemoryQuestionCommentRepository.findById(
      createdQuestionComment.id,
    )

    expect(foundQuestion).toEqual(createdQuestionComment)

    const result = await deleteQuestionCommentUseCase.execute({
      questionCommentId: new UniqueIdentifier(createdQuestionComment.id),
      authorId: new UniqueIdentifier(createdQuestionComment.authorId),
    })

    const foundQuestionAfterDeletion =
      await inMemoryQuestionCommentRepository.findById(
        createdQuestionComment.id,
      )

    expect(result.isRight()).toBe(true)
    expect(foundQuestionAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete a question comment', async () => {
    const createdQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentRepository.create(createdQuestionComment)

    const result = await deleteQuestionCommentUseCase.execute({
      authorId: new UniqueIdentifier('any-author-id-that-is-not-the-creator'),
      questionCommentId: new UniqueIdentifier(createdQuestionComment.id),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('User not allowed to delete this comment'),
    )
  })
})
