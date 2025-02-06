import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryQuestionCommentRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { makeQuestionComment } from '@/test/factories/make-question-comment'

describe('DeleteQuestionComment unit tests', () => {
  let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase
  let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository

  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentRepository,
    )
  })

  it('should be able to delete an question', async () => {
    const createdQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentRepository.create(createdQuestionComment)

    const foundQuestion = await inMemoryQuestionCommentRepository.findById(
      createdQuestionComment.id,
    )

    expect(foundQuestion).toEqual(createdQuestionComment)

    await deleteQuestionCommentUseCase.execute({
      questionCommentId: new UniqueIdentifier(createdQuestionComment.id),
      authorId: new UniqueIdentifier(createdQuestionComment.authorId),
    })

    const foundQuestionAfterDeletion =
      await inMemoryQuestionCommentRepository.findById(
        createdQuestionComment.id,
      )

    expect(foundQuestionAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete an question', async () => {
    const createdQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentRepository.create(createdQuestionComment)

    await expect(
      deleteQuestionCommentUseCase.execute({
        authorId: new UniqueIdentifier('any-author-id-that-is-not-the-creator'),
        questionCommentId: new UniqueIdentifier(createdQuestionComment.id),
      }),
    ).rejects.toThrowError('User not allowed to delete this comment')
  })
})
