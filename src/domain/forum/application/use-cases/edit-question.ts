import { Either, left, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'

export interface EditQuestionRequest {
  questionId: string
  authorId: string
  newContent: string
  title: string
  attachmentIds: string[]
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  public async execute({
    authorId,
    newContent,
    questionId,
    title,
    attachmentIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const foundQuestion = await this.questionsRepository.findById(questionId)

    if (!foundQuestion)
      return left(new ResourceNotFoundError('Question was not found'))
    if (foundQuestion.authorId !== authorId)
      return left(new NotAllowedError('Question is not from this author'))

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )
    const questionAttachmentsFromRequest = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueIdentifier(attachmentId),
        questionId: new UniqueIdentifier(foundQuestion.id),
      })
    })

    questionAttachmentList.update(questionAttachmentsFromRequest)

    foundQuestion.title = title
    foundQuestion.content = newContent
    foundQuestion.attachments = questionAttachmentList

    await this.questionsRepository.save(foundQuestion)

    return right({ question: foundQuestion })
  }
}
