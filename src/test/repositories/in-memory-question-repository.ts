import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
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
    this.questions = this.questions.filter((question) => question.id !== id)
  }

  public async findById(id: string): Promise<Question | undefined> {
    const foundQuestion = this.questions.find((question) => question.id === id)

    return foundQuestion
  }
}
