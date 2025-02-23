import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public answerAttachments: AnswerAttachment[] = []

  public async findManyByAnswerId(
    answerId: string,
  ): Promise<AnswerAttachment[]> {
    return this.answerAttachments.filter(
      (attachment) => answerId === attachment.answerId,
    )
  }

  public async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.answerAttachments.filter(
      (answerAttachment) => {
        return answerAttachment.answerId !== answerId
      },
    )

    this.answerAttachments = answerAttachments
  }
}
