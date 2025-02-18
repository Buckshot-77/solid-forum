import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
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
