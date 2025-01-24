import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const foundQuestion = this.questionRepository.findById(questionId)

    if (!foundQuestion)
      throw new Error('No question was found with the given ID')

    await this.questionRepository.deleteById(questionId)

    return {}
  }
}
