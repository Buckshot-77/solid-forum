import { expect, describe, it, beforeEach } from 'vitest'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { InMemoryQuestionCommentRepository } from '@/test/repositories/in-memory-question-comment-repository'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { makeQuestion } from '@/test/factories/make-question'

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

  it('should throw if question does not exist', async () => {
    await expect(
      commentOnQuestionUseCase.execute({
        authorId: new UniqueIdentifier('any-author-id'),
        content: 'any-content',
        questionId: new UniqueIdentifier('any-question-id'),
      }),
    ).rejects.toThrowError('Question not found')
  })

  it('should be able to create questionComment when a valid questionId is given', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const { questionComment: createdQuestionComment } =
      await commentOnQuestionUseCase.execute({
        authorId: new UniqueIdentifier('any-author-id'),
        content: 'any-content',
        questionId: new UniqueIdentifier(createdQuestion.id),
      })

    expect(createdQuestionComment.authorId).toEqual('any-author-id')
    expect(createdQuestionComment.content).toEqual('any-content')
    expect(createdQuestionComment.questionId).toEqual(createdQuestion.id)
  })
})
