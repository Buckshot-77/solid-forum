import { randTextRange } from '@ngneat/falso'

import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeAnswer(override?: Partial<AnswerProps>) {
  const answer = Answer.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    questionId: new UniqueIdentifier(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return answer
}
