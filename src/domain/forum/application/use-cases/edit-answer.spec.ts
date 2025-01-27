import { expect, describe, it, beforeEach } from 'vitest'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@/test/factories/make-answer'

describe('EditAnswer unit tests', () => {
  let editAnswerUseCase: EditAnswerUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository

  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    editAnswerUseCase = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should throw if answer does not exist', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    await expect(
      editAnswerUseCase.execute({
        authorId: createdAnswer.authorId,
        answerId: 'any-answer-id',
        newContent: 'new-content',
      }),
    ).rejects.toThrowError('Answer was not found')
  })

  it('should throw if author id is not the same as the answer author id', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    await expect(
      editAnswerUseCase.execute({
        authorId: 'another-author-id',
        answerId: createdAnswer.id,
        newContent: 'new-content',
      }),
    ).rejects.toThrowError('Answer is not from this author')
  })

  it('should be able to edit a answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const { answer } = await editAnswerUseCase.execute({
      authorId: createdAnswer.authorId,
      answerId: createdAnswer.id,
      newContent: 'new-content',
    })

    expect(answer.id).toBe(createdAnswer.id)
    expect(answer.authorId).toBe(createdAnswer.authorId)
    expect(answer.content).toBe('new-content')
  })
})
