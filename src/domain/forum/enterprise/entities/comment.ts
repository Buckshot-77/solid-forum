import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export interface CommentProps {
  authorId: UniqueIdentifier
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Comment<Props extends CommentProps> extends Entity<Props> {
  get content(): string {
    return this._props.content
  }

  get authorId(): string {
    return this._props.authorId.toString()
  }

  get createdAt(): Date {
    return this._props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt
  }

  get preview(): string {
    return this.content.slice(0, 120).trimEnd()
  }

  private touch(): void {
    this._props.updatedAt = new Date()
  }

  set content(content: string) {
    this._props.content = content
    this.touch()
  }
}
