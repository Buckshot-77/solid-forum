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
  static create(
    props: Optional<QuestionProps, 'createdAt'>,
    id?: UniqueIdentifier,
  ): Question {
    const question = new Question(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return question
  }
}
