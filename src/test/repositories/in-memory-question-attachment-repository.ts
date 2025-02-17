import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public questionAttachments: QuestionAttachment[] = []

  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.questionAttachments.filter(
      (attachment) => questionId === attachment.questionId,
    )
  }
}
