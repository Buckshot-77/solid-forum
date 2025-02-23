import { expect, describe, it, beforeEach } from 'vitest'

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

describe('DeleteAnswer unit tests', () => {
  let deleteAnswerUseCase: DeleteAnswerUseCase
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    deleteAnswerUseCase = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswersRepository.create(createdAnswer)

    const foundAnswer = await inMemoryAnswersRepository.findById(
      createdAnswer.id,
    )

    expect(foundAnswer).toEqual(createdAnswer)

    const result = await deleteAnswerUseCase.execute({
      answerId: createdAnswer.id,
      authorId: createdAnswer.authorId,
    })

    const foundAnswerAfterDeletion = await inMemoryAnswersRepository.findById(
      createdAnswer.id,
    )

    expect(result.isRight()).toBe(true)
    expect(foundAnswerAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete an answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswersRepository.create(createdAnswer)

    const result = await deleteAnswerUseCase.execute({
      authorId: 'any-author-id-that-is-not-the-creator',
      answerId: createdAnswer.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('User not allowed to delete this answer'),
    )
  })
})
