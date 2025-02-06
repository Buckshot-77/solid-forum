import { randTextRange } from '@ngneat/falso'

import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeQuestionComment(override?: Partial<QuestionCommentProps>) {
  const questioncomment = QuestionComment.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    questionId: new UniqueIdentifier(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return questioncomment
}
