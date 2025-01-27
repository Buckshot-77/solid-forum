import { expect, describe, it, beforeEach } from 'vitest'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'

describe('EditQuestion unit tests', () => {
  let editQuestionUseCase: EditQuestionUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    editQuestionUseCase = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should throw if question does not exist', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    await expect(
      editQuestionUseCase.execute({
        authorId: createdQuestion.authorId,
        questionId: 'any-question-id',
        newContent: 'new-content',
      }),
    ).rejects.toThrowError('Question was not found')
  })

  it('should throw if author id is not the same as the question author id', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    await expect(
      editQuestionUseCase.execute({
        authorId: 'another-author-id',
        questionId: createdQuestion.id,
        newContent: 'new-content',
      }),
    ).rejects.toThrowError('Question is not from this author')
  })

  it('should be able to edit a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const { question } = await editQuestionUseCase.execute({
      authorId: createdQuestion.authorId,
      questionId: createdQuestion.id,
      newContent: 'new-content',
    })

    expect(question.id).toBe(createdQuestion.id)
    expect(question.authorId).toBe(createdQuestion.authorId)
    expect(question.content).toBe('new-content')
  })
})
