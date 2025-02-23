import { expect, describe, it, beforeEach } from 'vitest'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

describe('SendNotification unit tests', () => {
  let sendNotificationUseCase: SendNotificationUseCase
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should be able to send a notification', async () => {
    const result = await sendNotificationUseCase.execute({
      recipientId: 'any recipient id',
      content: 'any content',
      title: 'any title',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notification: inMemoryNotificationsRepository.notifications[0],
    })
  })
})
