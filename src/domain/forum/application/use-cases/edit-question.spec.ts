import { expect, describe, it, beforeEach } from 'vitest'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

describe('EditQuestion unit tests', () => {
  let editQuestionUseCase: EditQuestionUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    editQuestionUseCase = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should return ResourceNotFound if question does not exist', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await editQuestionUseCase.execute({
      authorId: createdQuestion.authorId,
      questionId: 'any-question-id',
      newContent: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Question was not found'),
    )
  })

  it('should return NotAllowedError if author id is not the same as the question author id', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await editQuestionUseCase.execute({
      authorId: 'another-author-id',
      questionId: createdQuestion.id,
      newContent: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('Question is not from this author'),
    )
  })

  it('should be able to edit a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await editQuestionUseCase.execute({
      authorId: createdQuestion.authorId,
      questionId: createdQuestion.id,
      newContent: 'new-content',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      question: inMemoryQuestionRepository.questions[0],
    })
  })
})
