import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueIdentifier

  constructor(question: Question, bestAnswerId: UniqueIdentifier) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueIdentifier {
    return new UniqueIdentifier(this.question.id)
  }
}
