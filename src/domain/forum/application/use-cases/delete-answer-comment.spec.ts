import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'

import { NotAllowedError } from './errors/not-allowed-error'

describe('DeleteAnswerComment unit tests', () => {
  let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase
  let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository

  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentRepository,
    )
  })

  it('should be able to delete an answer comment', async () => {
    const createdAnswerComment = makeAnswerComment()
    await inMemoryAnswerCommentRepository.create(createdAnswerComment)

    const foundAnswer = await inMemoryAnswerCommentRepository.findById(
      createdAnswerComment.id,
    )

    expect(foundAnswer).toEqual(createdAnswerComment)

    const result = await deleteAnswerCommentUseCase.execute({
      answerCommentId: createdAnswerComment.id,
      authorId: createdAnswerComment.authorId,
    })

    const foundAnswerAfterDeletion =
      await inMemoryAnswerCommentRepository.findById(createdAnswerComment.id)

    expect(result.isRight()).toBe(true)
    expect(foundAnswerAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete an answer comment', async () => {
    const createdAnswerComment = makeAnswerComment()
    await inMemoryAnswerCommentRepository.create(createdAnswerComment)

    const result = await deleteAnswerCommentUseCase.execute({
      authorId: 'any-author-id-that-is-not-the-creator',
      answerCommentId: createdAnswerComment.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('User not allowed to delete this comment'),
    )
  })
})
