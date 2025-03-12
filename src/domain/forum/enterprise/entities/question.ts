import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen'

export interface QuestionProps {
  title: string
  slug: Slug
  content: string
  authorId: UniqueIdentifier
  bestAnswerId?: UniqueIdentifier
  attachments?: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get title(): string {
    return this._props.title
  }

  get slug(): string {
    return this._props.slug.value
  }

  get content(): string {
    return this._props.content
  }

  get authorId(): string {
    return this._props.authorId.toString()
  }

  get preview(): string {
    return this.content.slice(0, 120).trimEnd()
  }

  get bestAnswerId(): string | undefined {
    return this._props.bestAnswerId?.toString()
  }

  get isNew(): boolean {
    const THREE_DAYS_AGO = new Date().getMilliseconds() - 1000 * 3600 * 24 * 3

    if (this.createdAt.getMilliseconds() < THREE_DAYS_AGO) return true
    return false
  }

  get attachments() {
    return this._props.attachments ?? new QuestionAttachmentList()
  }

  get createdAt(): Date {
    return this._props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt
  }

  set content(content: string) {
    this._props.content = content
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this._props.attachments = attachments
  }

  set title(title: string) {
    this._props.title = title
    this._props.slug = Slug.createFromText(title)
    this.touch()
  }

  set bestAnswerId(id: UniqueIdentifier | undefined) {
    if (id === undefined) {
      return
    }

    if (
      this._props.bestAnswerId === undefined ||
      !id.equals(this._props.bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, id))
    }
    this._props.bestAnswerId = id
  }

  private touch() {
    this._props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>,
    id?: UniqueIdentifier,
  ): Question {
    const question = new Question(
      {
        createdAt: new Date(),
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )

    return question
  }
}
