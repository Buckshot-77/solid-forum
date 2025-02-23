import { expect, describe, it, beforeEach } from 'vitest'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('CommentOnQuestion unit tests', () => {
  let commentOnQuestionUseCase: CommentOnQuestionUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    commentOnQuestionUseCase = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should return ResourceNotFoundError if question does not exist', async () => {
    const result = await commentOnQuestionUseCase.execute({
      authorId: 'any-author-id',
      content: 'any-content',
      questionId: 'any-question-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Question not found'),
    )
  })

  it('should be able to create questionComment when a valid questionId is given', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(createdQuestion)

    const result = await commentOnQuestionUseCase.execute({
      authorId: 'any-author-id',
      content: 'any-content',
      questionId: createdQuestion.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      questionComment: inMemoryQuestionCommentsRepository.questionComments[0],
    })
  })
})
