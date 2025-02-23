import { describe, it, beforeEach, expect } from 'vitest'

import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from '@/test/factories/make-notification'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'

describe('Read Notification', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let readNotificationUseCase: ReadNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    readNotificationUseCase = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should be able to read notification if given recipient id is equal to notification recipient id', async () => {
    const createdNotification = makeNotification({
      recipientId: new UniqueIdentifier('my-unique-identifier'),
      readAt: undefined,
    })

    await inMemoryNotificationsRepository.create(createdNotification)

    const result = await readNotificationUseCase.execute({
      notificationId: createdNotification.id,
      recipientId: 'my-unique-identifier',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notification: expect.objectContaining({ readAt: expect.any(Date) }),
    })
  })

  it('should return an error if a notification is not found', async () => {
    const createdNotification = makeNotification({
      recipientId: new UniqueIdentifier('my-unique-identifier'),
      readAt: undefined,
    })

    await inMemoryNotificationsRepository.create(createdNotification)

    const result = await readNotificationUseCase.execute({
      notificationId: 'any-notification-id',
      recipientId: 'my-unique-identifier',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Notification was not found'),
    )
  })

  it('should not allow a notification to be read if recipientId differs from the one in the notification', async () => {
    const createdNotification = makeNotification({
      recipientId: new UniqueIdentifier('my-unique-identifier'),
      readAt: undefined,
    })

    await inMemoryNotificationsRepository.create(createdNotification)

    const result = await readNotificationUseCase.execute({
      notificationId: createdNotification.id,
      recipientId: 'my-unique-identifier-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('Notification is not from this recipient'),
    )
  })
})
