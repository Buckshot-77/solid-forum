import { expect, describe, it, beforeEach } from 'vitest'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { InMemoryQuestionCommentRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { makeQuestion } from '@/test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('CommentOnQuestion unit tests', () => {
  let commentOnQuestionUseCase: CommentOnQuestionUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository
  let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    commentOnQuestionUseCase = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository,
    )
  })

  it('should return ResourceNotFoundError if question does not exist', async () => {
    const result = await commentOnQuestionUseCase.execute({
      authorId: new UniqueIdentifier('any-author-id'),
      content: 'any-content',
      questionId: new UniqueIdentifier('any-question-id'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Question not found'),
    )
  })

  it('should be able to create questionComment when a valid questionId is given', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await commentOnQuestionUseCase.execute({
      authorId: new UniqueIdentifier('any-author-id'),
      content: 'any-content',
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      questionComment: inMemoryQuestionCommentRepository.questionComments[0],
    })
  })
})
