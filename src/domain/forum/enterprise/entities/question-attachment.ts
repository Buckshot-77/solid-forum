import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export interface QuestionAttachmentProps {
  questionId: UniqueIdentifier
  attachmentId: UniqueIdentifier
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this._props.questionId.toString()
  }

  get attachmentId() {
    return this._props.attachmentId.toString()
  }

  static create(props: QuestionAttachmentProps, id?: UniqueIdentifier) {
    const questionAttachment = new QuestionAttachment(props, id)

    return questionAttachment
  }
}
