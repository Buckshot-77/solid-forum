import { expect, describe, it, beforeEach } from 'vitest'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

describe('EditAnswer unit tests', () => {
  let editAnswerUseCase: EditAnswerUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository

  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    editAnswerUseCase = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should return ResourceNotFoundError if answer does not exist', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const result = await editAnswerUseCase.execute({
      authorId: createdAnswer.authorId,
      answerId: 'any-answer-id',
      newContent: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Answer was not found'),
    )
  })

  it('should return NotAllowedError if author id is not the same as the answer author id', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const result = await editAnswerUseCase.execute({
      authorId: 'another-author-id',
      answerId: createdAnswer.id,
      newContent: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('Answer is not from this author'),
    )
  })

  it('should be able to edit an answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const result = await editAnswerUseCase.execute({
      authorId: createdAnswer.authorId,
      answerId: createdAnswer.id,
      newContent: 'new-content',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      answer: inMemoryAnswerRepository.answers[0],
    })
  })
})
