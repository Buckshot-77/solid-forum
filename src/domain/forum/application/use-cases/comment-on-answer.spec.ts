import { expect, describe, it, beforeEach } from 'vitest'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { makeAnswer } from '@/test/factories/make-answer'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

  it('should return ResourceNotFoundError if answer does not exist', async () => {
    const result = await commentOnAnswerUseCase.execute({
      authorId: new UniqueIdentifier('any-author-id'),
      content: 'any-content',
      answerId: new UniqueIdentifier('any-answer-id'),
    })

    expect(result.isLeft())
    expect(result.value).toEqual(new ResourceNotFoundError('Answer not found'))
  })

  it('should be able to create answerComment when a valid answerId is given', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const result = await commentOnAnswerUseCase.execute({
      authorId: new UniqueIdentifier('any-author-id'),
      content: 'any-content',
      answerId: new UniqueIdentifier(createdAnswer.id),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      answerComment: inMemoryAnswerCommentRepository.answerComments[0],
    })
  })
})
