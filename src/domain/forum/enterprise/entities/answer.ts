import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'

interface AnswerProps {
  content: string
  authorId: UniqueIdentifier
  questionId: UniqueIdentifier
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get content(): string {
    return this._props.content
  }

  get authorId(): string {
    return this._props.authorId.toString()
  }

  get questionId(): string {
    return this._props.questionId.toString()
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

  static create(
    props: Optional<AnswerProps, 'createdAt'>,
    id?: UniqueIdentifier,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return answer
  }
}
