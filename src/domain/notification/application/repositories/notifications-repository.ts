import { Notification } from '@/domain/notification/enterprise/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
  deleteById(id: string): Promise<void>
  findById(id: string): Promise<Notification | undefined>
}
