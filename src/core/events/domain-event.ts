import { UniqueIdentifier } from '../entities/value-objects/unique-identifier'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueIdentifier
}
