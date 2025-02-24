import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    const idInstanceA = new UniqueIdentifier(a.attachmentId)
    const idInstanceB = new UniqueIdentifier(b.attachmentId)

    return idInstanceA.equals(idInstanceB)
  }
}
