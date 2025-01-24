import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswerRepository implements AnswerRepository {
  public answers: Answer[] = []
  public async create(answer: Answer): Promise<void> {
    this.answers.push(answer)
  }
}
