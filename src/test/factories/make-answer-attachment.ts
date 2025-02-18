import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeAnswerAttachment(
  override?: Partial<AnswerAttachmentProps>,
) {
  const answerAttachment = AnswerAttachment.create({
    attachmentId: new UniqueIdentifier(),
    answerId: new UniqueIdentifier(),
    ...override,
  })

  return answerAttachment
}
