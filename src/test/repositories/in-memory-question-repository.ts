import {
  QuestionRepository,
  EditQuestionRepositoryRequest,
} from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  public questions: Question[] = []

  public async findBySlug(slug_text: string): Promise<Question | undefined> {
    const foundQuestion = this.questions.find(
      (question) => question.slug === slug_text,
    )

    return foundQuestion
  }

  public async create(question: Question): Promise<void> {
    this.questions.push(question)
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.questions.findIndex(
      (question) => question.id === id,
    )

    if (foundIndex === -1) {
      return
    }

    this.questions.splice(foundIndex, 1)
  }

  public async findById(id: string): Promise<Question | undefined> {
    const foundQuestion = this.questions.find((question) => question.id === id)

    return foundQuestion
  }

  public async edit({
    newContent,
    question,
  }: EditQuestionRepositoryRequest): Promise<Question> {
    const foundQuestionIndex = this.questions.findIndex(
      (iteratedQuestion) => iteratedQuestion.id === question.id,
    )

    this.questions.splice(foundQuestionIndex, 1)

    question.content = newContent

    console.log(question)

    this.questions.push(question)

    return question
  }
}
