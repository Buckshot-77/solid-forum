import { randSentence } from '@ngneat/falso'

import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeNotification(override?: Partial<NotificationProps>) {
  const notification = Notification.create({
    content: randSentence({ length: 10 }).join(' '),
    recipientId: new UniqueIdentifier(),
    title: randSentence({ length: 3 }).join(' '),
    createdAt: new Date(),
    readAt: new Date(),
    ...override,
  })

  return notification
}
