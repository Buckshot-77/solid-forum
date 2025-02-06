import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'

describe('DeleteAnswerComment unit tests', () => {
  let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase
  let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository

  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentRepository,
    )
  })

  it('should be able to delete an answer', async () => {
    const createdAnswerComment = makeAnswerComment()
    await inMemoryAnswerCommentRepository.create(createdAnswerComment)

    const foundAnswer = await inMemoryAnswerCommentRepository.findById(
      createdAnswerComment.id,
    )

    expect(foundAnswer).toEqual(createdAnswerComment)

    await deleteAnswerCommentUseCase.execute({
      answerCommentId: new UniqueIdentifier(createdAnswerComment.id),
      authorId: new UniqueIdentifier(createdAnswerComment.authorId),
    })

    const foundAnswerAfterDeletion =
      await inMemoryAnswerCommentRepository.findById(createdAnswerComment.id)

    expect(foundAnswerAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete an answer', async () => {
    const createdAnswerComment = makeAnswerComment()
    await inMemoryAnswerCommentRepository.create(createdAnswerComment)

    await expect(
      deleteAnswerCommentUseCase.execute({
        authorId: new UniqueIdentifier('any-author-id-that-is-not-the-creator'),
        answerCommentId: new UniqueIdentifier(createdAnswerComment.id),
      }),
    ).rejects.toThrowError('User not allowed to delete this comment')
  })
})
