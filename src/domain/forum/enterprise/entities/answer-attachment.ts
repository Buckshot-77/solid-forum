import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export interface AnswerAttachmentProps {
  answerId: UniqueIdentifier
  attachmentId: UniqueIdentifier
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this._props.answerId
  }

  get attachmentId() {
    return this._props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueIdentifier) {
    const answerAttachment = new AnswerAttachment(props, id)

    return answerAttachment
  }
}
