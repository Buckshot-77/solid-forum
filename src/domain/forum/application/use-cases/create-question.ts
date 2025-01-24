import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

interface CreateQuestionUseCaseRequest {
  title: string
  authorId: string
  content: string
}

interface CreateQuestionUseCaseResponse {
  authorId: string
  questionId: string
  content: string
  title: string
  slug: string
}

export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}
  async execute({
    title,
    content,
    authorId,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueIdentifier(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.questionRepository.create(question)

    return {
      authorId: question.authorId,
      questionId: question.id,
      content: question.content,
      slug: question.slug,
      title: question.title,
    }
  }
}
