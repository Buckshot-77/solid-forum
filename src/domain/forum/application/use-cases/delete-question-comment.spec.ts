import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

describe('DeleteQuestionComment unit tests', () => {
  let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to delete a question comment', async () => {
    const createdQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentsRepository.create(createdQuestionComment)

    const foundQuestion = await inMemoryQuestionCommentsRepository.findById(
      createdQuestionComment.id,
    )

    expect(foundQuestion).toEqual(createdQuestionComment)

    const result = await deleteQuestionCommentUseCase.execute({
      questionCommentId: createdQuestionComment.id,
      authorId: createdQuestionComment.authorId,
    })

    const foundQuestionAfterDeletion =
      await inMemoryQuestionCommentsRepository.findById(
        createdQuestionComment.id,
      )

    expect(result.isRight()).toBe(true)
    expect(foundQuestionAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete a question comment', async () => {
    const createdQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentsRepository.create(createdQuestionComment)

    const result = await deleteQuestionCommentUseCase.execute({
      authorId: 'any-author-id-that-is-not-the-creator',
      questionCommentId: createdQuestionComment.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('User not allowed to delete this comment'),
    )
  })
})
