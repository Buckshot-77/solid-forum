import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repository/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  public async findBySlug(slug_text: string): Promise<Question | undefined> {
    const foundQuestion = this.questions.find(
      (question) => question.slug === slug_text,
    )

    return foundQuestion
  }

  public async findManyRecent({
    pageSize,
    page,
  }: PaginationParams): Promise<Question[]> {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)

    return questions
  }

  public async create(question: Question): Promise<void> {
    this.questions.push(question)

    DomainEvents.dispatchEventsForAggregate(new UniqueIdentifier(question.id))
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.questions.findIndex(
      (question) => question.id === id,
    )

    if (foundIndex === -1) {
      return
    }

    await this.questionAttachmentsRepository.deleteManyByQuestionId(id)

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

    DomainEvents.dispatchEventsForAggregate(new UniqueIdentifier(question.id))
  }
}
