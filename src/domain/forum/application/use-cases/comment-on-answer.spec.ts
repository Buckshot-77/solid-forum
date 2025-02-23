import { expect, describe, it, beforeEach } from 'vitest'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

describe('CommentOnAnswer unit tests', () => {
  let commentOnAnswerUseCase: CommentOnAnswerUseCase
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    commentOnAnswerUseCase = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should return ResourceNotFoundError if answer does not exist', async () => {
    const result = await commentOnAnswerUseCase.execute({
      authorId: 'any-author-id',
      content: 'any-content',
      answerId: 'any-answer-id',
    })

    expect(result.isLeft())
    expect(result.value).toEqual(new ResourceNotFoundError('Answer not found'))
  })

  it('should be able to create answerComment when a valid answerId is given', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswersRepository.create(createdAnswer)

    const result = await commentOnAnswerUseCase.execute({
      authorId: 'any-author-id',
      content: 'any-content',
      answerId: createdAnswer.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      answerComment: inMemoryAnswerCommentsRepository.answerComments[0],
    })
  })
})
