import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachment } from './question-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    const idInstanceA = new UniqueIdentifier(a.attachmentId)
    const idInstanceB = new UniqueIdentifier(b.attachmentId)

    return idInstanceA.equals(idInstanceB)
  }
}
