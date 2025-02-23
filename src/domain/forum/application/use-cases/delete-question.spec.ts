import { expect, describe, it, beforeEach } from 'vitest'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'

import { NotAllowedError } from './errors/not-allowed-error'

describe('DeleteQuestion unit tests', () => {
  let deleteQuestionUseCase: DeleteQuestionUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    deleteQuestionUseCase = new DeleteQuestionUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to delete a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(createdQuestion)

    const foundQuestion = await inMemoryQuestionsRepository.findById(
      createdQuestion.id,
    )

    expect(foundQuestion).toEqual(createdQuestion)

    inMemoryQuestionAttachmentsRepository.questionAttachments.push(
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
      await inMemoryQuestionsRepository.findById(createdQuestion.id)

    expect(result.isRight()).toBe(true)
    expect(foundQuestionAfterDeletion).not.toBeTruthy()
    expect(
      inMemoryQuestionAttachmentsRepository.questionAttachments,
    ).toHaveLength(0)
  })

  it('should not allow a user that is not the author to delete a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(createdQuestion)

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
