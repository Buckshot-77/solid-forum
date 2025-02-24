import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created'

export interface AnswerProps {
  content: string
  authorId: UniqueIdentifier
  questionId: UniqueIdentifier
  attachments?: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
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

  get attachments() {
    return this._props.attachments ?? new AnswerAttachmentList()
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt
  }

  set attachments(attachments: AnswerAttachmentList) {
    this._props.attachments = attachments
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
        createdAt: new Date(),
        attachments: props.attachments ?? new AnswerAttachmentList(),
        ...props,
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
