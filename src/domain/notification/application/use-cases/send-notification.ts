import { Either, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

interface SendNotificationUseCaseRequest {
  title: string
  recipientId: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  async execute({
    title,
    content,
    recipientId,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId: new UniqueIdentifier(recipientId),
      createdAt: new Date(),
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
