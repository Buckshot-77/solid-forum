import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'

export interface QuestionProps {
  title: string
  slug: Slug
  content: string
  authorId: UniqueIdentifier
  bestAnswerId?: UniqueIdentifier
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
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

  get bestAnswerId(): string | undefined {
    return this._props.bestAnswerId?.toString()
  }

  get createdAt(): Date {
    return this._props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt
  }

  get isNew(): boolean {
    const THREE_DAYS_AGO = new Date().getMilliseconds() - 1000 * 3600 * 24 * 3

    if (this.createdAt.getMilliseconds() < THREE_DAYS_AGO) return true
    return false
  }

  get preview(): string {
    return this.content.slice(0, 120).trimEnd()
  }

  private touch() {
    this._props.updatedAt = new Date()
  }

  set content(content: string) {
    this._props.content = content
    this.touch()
  }

  set title(title: string) {
    this._props.title = title
    this._props.slug = Slug.createFromText(title)
    this.touch()
  }

  set bestAnswerId(id: UniqueIdentifier | undefined) {
    this._props.bestAnswerId = id
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
      },
      id,
    )

    return question
  }
}
