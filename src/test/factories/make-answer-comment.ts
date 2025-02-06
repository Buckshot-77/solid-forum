import { randTextRange } from '@ngneat/falso'

import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeAnswerComment(override?: Partial<AnswerCommentProps>) {
  const answercomment = AnswerComment.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    answerId: new UniqueIdentifier(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return answercomment
}
