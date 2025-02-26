import { Either, left, right } from '@/core/types/either'

import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const foundNotification =
      await this.notificationsRepository.findById(notificationId)

    if (!foundNotification)
      return left(new ResourceNotFoundError('Notification was not found'))

    if (foundNotification.recipientId !== recipientId)
      return left(
        new NotAllowedError('Notification is not from this recipient'),
      )

    foundNotification.read()

    await this.notificationsRepository.save(foundNotification)

    return right({ notification: foundNotification })
  }
}
