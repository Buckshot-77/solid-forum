import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueIdentifier
  title: string
  content: string
  createdAt: Date
  readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this._props.recipientId.toString()
  }

  get title() {
    return this._props.title
  }

  get content() {
    return this._props.content
  }

  get createdAt() {
    return this._props.createdAt
  }

  get readAt() {
    return this._props.readAt
  }

  read() {
    this._props.readAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueIdentifier,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
