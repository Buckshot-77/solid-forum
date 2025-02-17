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

  public async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) => {
        return questionAttachment.questionId !== questionId
      },
    )

    this.questionAttachments = questionAttachments
  }
}
