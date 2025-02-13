import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

describe('DeleteAnswer unit tests', () => {
  let deleteAnswerUseCase: DeleteAnswerUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository

  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    deleteAnswerUseCase = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to delete an answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const foundAnswer = await inMemoryAnswerRepository.findById(
      createdAnswer.id,
    )

    expect(foundAnswer).toEqual(createdAnswer)

    const result = await deleteAnswerUseCase.execute({
      answerId: new UniqueIdentifier(createdAnswer.id),
      authorId: new UniqueIdentifier(createdAnswer.authorId),
    })

    const foundAnswerAfterDeletion = await inMemoryAnswerRepository.findById(
      createdAnswer.id,
    )

    expect(result.isRight()).toBe(true)
    expect(foundAnswerAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete an answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const result = await deleteAnswerUseCase.execute({
      authorId: new UniqueIdentifier('any-author-id-that-is-not-the-creator'),
      answerId: new UniqueIdentifier(createdAnswer.id),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('User not allowed to delete this answer'),
    )
  })
})
