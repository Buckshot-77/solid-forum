import { Slug } from '@/domain/entities/value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'

interface QuestionProps {
  title: string
  slug: Slug
  content: string
  authorId: UniqueIdentifier
  bestAnswerId?: UniqueIdentifier
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get title() {
    return this._props.title
  }

  get slug() {
    return this._props.slug
  }

  get content() {
    return this._props.content
  }

  get authorId() {
    return this._props.authorId
  }

  get bestAnswerId() {
    return this._props.bestAnswerId
  }

  get createdAt() {
    return this._props.createdAt
  }

  get updatedAt() {
    return this._props.updatedAt
  }

  get isNew() {
    const THREE_DAYS_AGO = new Date().getMilliseconds() - 1000 * 3600 * 24 * 3

    if (this.createdAt.getMilliseconds() < THREE_DAYS_AGO) return true
    return false
  }

  get preview() {
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
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: new Date(),
      },
      id,
    )

    return question
  }
}
