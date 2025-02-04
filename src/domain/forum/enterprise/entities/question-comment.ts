import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Optional } from '@/core/types/optional'
import {
  CommentProps,
  Comment,
} from '@/domain/forum/enterprise/entities/comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueIdentifier
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId(): string {
    return this._props.questionId.toString()
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueIdentifier,
  ): QuestionComment {
    const questionComment = new QuestionComment(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return questionComment
  }
}
