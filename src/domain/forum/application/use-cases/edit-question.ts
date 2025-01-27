import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export interface EditQuestionRequest {
  questionId: string
  authorId: string
  newContent: string
}

export interface EditQuestionResponse {
  question: Question
}

export class EditQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  public async execute({
    authorId,
    newContent,
    questionId,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const foundQuestion = await this.questionRepository.findById(questionId)

    if (!foundQuestion) throw new Error('Question was not found')
    if (foundQuestion.authorId !== authorId)
      throw new Error('Question is not from this author')

    const editedQuestion = await this.questionRepository.edit({
      newContent,
      question: foundQuestion,
    })

    return { question: editedQuestion }
  }
}
