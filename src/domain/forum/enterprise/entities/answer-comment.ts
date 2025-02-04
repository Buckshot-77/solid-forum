import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'
import {
  CommentProps,
  Comment,
} from '@/domain/forum/enterprise/entities/comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueIdentifier
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): string {
    return this._props.answerId.toString()
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueIdentifier,
  ): AnswerComment {
    const answerComment = new AnswerComment(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return answerComment
  }
}
