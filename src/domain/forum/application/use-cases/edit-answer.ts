import { Either, left, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'

import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'

export interface EditAnswerRequest {
  answerId: string
  authorId: string
  newContent: string
  attachmentIds: string[]
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  public async execute({
    authorId,
    newContent,
    answerId,
    attachmentIds,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const foundAnswer = await this.answersRepository.findById(answerId)

    if (!foundAnswer)
      return left(new ResourceNotFoundError('Answer was not found'))
    if (foundAnswer.authorId !== authorId)
      return left(new NotAllowedError('Answer is not from this author'))

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )
    const answerAttachmentsFromRequest = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueIdentifier(attachmentId),
        answerId: new UniqueIdentifier(foundAnswer.id),
      })
    })

    answerAttachmentList.update(answerAttachmentsFromRequest)

    foundAnswer.content = newContent
    foundAnswer.attachments = answerAttachmentList

    await this.answersRepository.save(foundAnswer)

    return right({ answer: foundAnswer })
  }
}
