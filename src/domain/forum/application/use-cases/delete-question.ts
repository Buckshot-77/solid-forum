import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const foundQuestion = await this.questionRepository.findById(questionId)

    if (!foundQuestion)
      throw new Error('No question was found with the given ID')

    if (foundQuestion.authorId !== authorId)
      throw new Error('User not allowed to delete this question')

    await this.questionRepository.deleteById(questionId)

    return {}
  }
}
