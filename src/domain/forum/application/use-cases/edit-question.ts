import { Either, left, right } from '@/core/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository'

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
    private readonly questionRepository: QuestionRepository,
    private readonly questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  public async execute({
    authorId,
    newContent,
    questionId,
    title,
    attachmentIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const foundQuestion = await this.questionRepository.findById(questionId)

    if (!foundQuestion)
      return left(new ResourceNotFoundError('Question was not found'))
    if (foundQuestion.authorId !== authorId)
      return left(new NotAllowedError('Question is not from this author'))

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId)

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

    await this.questionRepository.save(foundQuestion)

    return right({ question: foundQuestion })
  }
}
