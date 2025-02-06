import { expect, describe, it, beforeEach } from 'vitest'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { makeAnswer } from '@/test/factories/make-answer'

describe('CommentOnAnswer unit tests', () => {
  let commentOnAnswerUseCase: CommentOnAnswerUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository
  let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository

  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    commentOnAnswerUseCase = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    )
  })

  it('should throw if answer does not exist', async () => {
    await expect(
      commentOnAnswerUseCase.execute({
        authorId: new UniqueIdentifier('any-author-id'),
        content: 'any-content',
        answerId: new UniqueIdentifier('any-answer-id'),
      }),
    ).rejects.toThrowError('Answer not found')
  })

  it('should be able to create answerComment when a valid answerId is given', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const { answerComment: createdAnswerComment } =
      await commentOnAnswerUseCase.execute({
        authorId: new UniqueIdentifier('any-author-id'),
        content: 'any-content',
        answerId: new UniqueIdentifier(createdAnswer.id),
      })

    expect(createdAnswerComment.authorId).toEqual('any-author-id')
    expect(createdAnswerComment.content).toEqual('any-content')
    expect(createdAnswerComment.answerId).toEqual(createdAnswer.id)
  })
})
