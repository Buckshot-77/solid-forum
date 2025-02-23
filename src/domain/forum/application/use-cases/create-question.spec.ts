import { expect, describe, it, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

describe('CreateQuestion unit tests', () => {
  let createQuestionUseCase: CreateQuestionUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    createQuestionUseCase = new CreateQuestionUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to create a question', async () => {
    const result = await createQuestionUseCase.execute({
      authorId: 'any author id',
      content: 'any content',
      title: 'any title',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      question: inMemoryQuestionsRepository.questions[0],
    })
  })
})
