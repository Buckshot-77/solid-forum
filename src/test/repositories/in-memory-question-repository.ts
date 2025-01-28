import { PaginationParams } from '@/core/repository/pagination-params'
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

  public async findManyRecent({
    page_size,
    page,
  }: PaginationParams): Promise<Question[]> {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * page_size, page * page_size)

    return questions
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

  public async save(question: Question): Promise<void> {
    const foundQuestionIndex = this.questions.findIndex(
      (iteratedQuestion) => iteratedQuestion.id === question.id,
    )

    this.questions[foundQuestionIndex] = question
  }
}
