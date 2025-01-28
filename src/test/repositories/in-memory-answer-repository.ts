import { PaginationParams } from '@/core/repository/pagination-params'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswerRepository implements AnswerRepository {
  public answers: Answer[] = []

  public async create(answer: Answer): Promise<void> {
    this.answers.push(answer)
  }

  public async findManyByQuestionId(
    questionId: string,
    { page, pageSize }: PaginationParams,
  ): Promise<Answer[]> {
    const foundAnswers = this.answers
      .filter((answer) => answer.questionId === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)

    return foundAnswers
  }

  public async findById(id: string): Promise<Answer | undefined> {
    return this.answers.find((answer) => answer.id === id)
  }

  public async findByQuestionId(questionId: string): Promise<Answer[]> {
    const filteredAnswers = this.answers.filter(
      (answer) => answer.questionId === questionId,
    )

    return filteredAnswers
  }

  public async save(answer: Answer): Promise<void> {
    const foundAnswerIndex = this.answers.findIndex(
      (iteratedAnswer) => iteratedAnswer.id === answer.id,
    )

    this.answers[foundAnswerIndex] = answer
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.answers.findIndex((answer) => answer.id === id)

    if (foundIndex === -1) {
      return
    }

    this.answers.splice(foundIndex, 1)
  }
}
