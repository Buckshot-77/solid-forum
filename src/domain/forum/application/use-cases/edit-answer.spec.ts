import { expect, describe, it, beforeEach } from 'vitest'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { InMemoryAnswerAttachmentRepository } from '@/test/repositories/in-memory-answer-attachment-repository'

import { makeAnswer } from '@/test/factories/make-answer'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

describe('EditAnswer unit tests', () => {
  let editAnswerUseCase: EditAnswerUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository
  let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )

    editAnswerUseCase = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    )
  })

  it('should return ResourceNotFound if answer does not exist', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    const result = await editAnswerUseCase.execute({
      authorId: createdAnswer.authorId,
      answerId: 'any-answer-id',
      newContent: 'new-content',
      attachmentIds: ['1', '2'],
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
      attachmentIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('Answer is not from this author'),
    )
  })

  it('should be able to edit a answer', async () => {
    const createdAnswer = makeAnswer()
    await inMemoryAnswerRepository.create(createdAnswer)

    inMemoryAnswerAttachmentRepository.answerAttachments.push(
      makeAnswerAttachment({
        answerId: new UniqueIdentifier(createdAnswer.id),
        attachmentId: new UniqueIdentifier('1'),
      }),
      makeAnswerAttachment({
        answerId: new UniqueIdentifier(createdAnswer.id),
        attachmentId: new UniqueIdentifier('2'),
      }),
    )

    const result = await editAnswerUseCase.execute({
      authorId: createdAnswer.authorId,
      answerId: createdAnswer.id,
      newContent: 'new-content',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      answer: expect.objectContaining({
        content: 'new-content',
      }),
    })
    expect(
      inMemoryAnswerRepository.answers[0].attachments.currentItems,
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
