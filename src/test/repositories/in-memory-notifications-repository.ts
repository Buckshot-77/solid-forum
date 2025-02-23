import { PaginationParams } from '@/core/repository/pagination-params'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = []

  public async findManyRecent({
    pageSize,
    page,
  }: PaginationParams): Promise<Notification[]> {
    const notifications = this.notifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)

    return notifications
  }

  public async create(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.notifications.findIndex(
      (notification) => notification.id === id,
    )

    if (foundIndex === -1) {
      return
    }

    this.notifications.splice(foundIndex, 1)
  }

  public async findById(id: string): Promise<Notification | undefined> {
    const foundNotification = this.notifications.find(
      (notification) => notification.id === id,
    )

    return foundNotification
  }

  public async save(notification: Notification): Promise<void> {
    const foundNotificationIndex = this.notifications.findIndex(
      (iteratedNotification) => iteratedNotification.id === notification.id,
    )

    this.notifications[foundNotificationIndex] = notification
  }
}
