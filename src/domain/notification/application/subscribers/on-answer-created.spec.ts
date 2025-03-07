import { describe, beforeEach, it, vi, expect } from 'vitest'

import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: new UniqueIdentifier(question.id) })

    const sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    expect(sendNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: question.authorId,
        title: `Nova resposta em ${question.title.substring(0, 40).concat('...')}`,
        content: answer.preview,
      }),
    )
  })
})
