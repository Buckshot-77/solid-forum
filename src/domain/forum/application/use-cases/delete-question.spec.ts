import { expect, describe, it, beforeEach } from 'vitest'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachment-repository'

import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'

import { NotAllowedError } from './errors/not-allowed-error'

describe('DeleteQuestion unit tests', () => {
  let deleteQuestionUseCase: DeleteQuestionUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository
  let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )
    deleteQuestionUseCase = new DeleteQuestionUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should be able to delete a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const foundQuestion = await inMemoryQuestionRepository.findById(
      createdQuestion.id,
    )

    expect(foundQuestion).toEqual(createdQuestion)

    inMemoryQuestionAttachmentRepository.questionAttachments.push(
      makeQuestionAttachment({
        questionId: new UniqueIdentifier(createdQuestion.id),
      }),
      makeQuestionAttachment({
        questionId: new UniqueIdentifier(createdQuestion.id),
      }),
    )

    const result = await deleteQuestionUseCase.execute({
      questionId: createdQuestion.id,
      authorId: createdQuestion.authorId,
    })

    const foundQuestionAfterDeletion =
      await inMemoryQuestionRepository.findById(createdQuestion.id)

    expect(result.isRight()).toBe(true)
    expect(foundQuestionAfterDeletion).not.toBeTruthy()
    expect(
      inMemoryQuestionAttachmentRepository.questionAttachments,
    ).toHaveLength(0)
  })

  it('should not allow a user that is not the author to delete a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const result = await deleteQuestionUseCase.execute({
      authorId: 'any-author-id-that-is-not-the-creator',
      questionId: createdQuestion.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('User not allowed to delete this question'),
    )
  })
})
