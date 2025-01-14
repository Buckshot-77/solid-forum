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
  get content() {
    return this._props.content
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
