import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'

interface DeleteAnswerUseCaseRequest {
  answerId: UniqueIdentifier
  authorId: UniqueIdentifier
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const foundAnswer = await this.answerRepository.findById(
      answerId.toString(),
    )

    if (!foundAnswer) throw new Error('No answer was found with the given ID')

    if (foundAnswer.authorId !== authorId.toString())
      throw new Error('User not allowed to delete this answer')

    await this.answerRepository.deleteById(answerId.toString())

    return {}
  }
}
