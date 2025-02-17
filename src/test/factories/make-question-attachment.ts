import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeQuestionAttachment(
  override?: Partial<QuestionAttachmentProps>,
) {
  const questionAttachment = QuestionAttachment.create({
    attachmentId: new UniqueIdentifier(),
    questionId: new UniqueIdentifier(),
    ...override,
  })

  return questionAttachment
}
