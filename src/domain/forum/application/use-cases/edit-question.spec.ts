import { expect, describe, it, beforeEach } from 'vitest'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

import { makeQuestion } from '@/test/factories/make-question'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

describe('EditQuestion unit tests', () => {
  let editQuestionUseCase: EditQuestionUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    editQuestionUseCase = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should return ResourceNotFound if question does not exist', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(createdQuestion)

    const result = await editQuestionUseCase.execute({
      authorId: createdQuestion.authorId,
      questionId: 'any-question-id',
      newContent: 'new-content',
      title: 'new-title',
      attachmentIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Question was not found'),
    )
  })

  it('should return NotAllowedError if author id is not the same as the question author id', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(createdQuestion)

    const result = await editQuestionUseCase.execute({
      authorId: 'another-author-id',
      questionId: createdQuestion.id,
      newContent: 'new-content',
      title: 'new-title',
      attachmentIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('Question is not from this author'),
    )
  })

  it('should be able to edit a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(createdQuestion)

    inMemoryQuestionAttachmentsRepository.questionAttachments.push(
      makeQuestionAttachment({
        questionId: new UniqueIdentifier(createdQuestion.id),
        attachmentId: new UniqueIdentifier('1'),
      }),
      makeQuestionAttachment({
        questionId: new UniqueIdentifier(createdQuestion.id),
        attachmentId: new UniqueIdentifier('2'),
      }),
    )

    const result = await editQuestionUseCase.execute({
      authorId: createdQuestion.authorId,
      questionId: createdQuestion.id,
      newContent: 'new-content',
      title: 'new-title',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      question: expect.objectContaining({
        title: 'new-title',
        content: 'new-content',
      }),
    })
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({
        _props: expect.objectContaining({
          attachmentId: new UniqueIdentifier('1'),
        }),
      }),
      expect.objectContaining({
        _props: expect.objectContaining({
          attachmentId: new UniqueIdentifier('3'),
        }),
      }),
    ])
  })
})
