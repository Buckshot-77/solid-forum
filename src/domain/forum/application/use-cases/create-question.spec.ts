import { expect, describe, it, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

const fakeQuestionRepository: QuestionRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (_question: Question) => {
    return
  },
}

describe('QuestionQuestion unit tests', () => {
  let createQuestionUseCase: CreateQuestionUseCase

  beforeEach(() => {
    createQuestionUseCase = new CreateQuestionUseCase(fakeQuestionRepository)
  })

  it('should be able to create an question', async () => {
    const response = await createQuestionUseCase.execute({
      authorId: 'any author id',
      content: 'any content',
      title: 'any title',
    })

    expect(response).toEqual({
      authorId: 'any author id',
      content: 'any content',
      slug: 'any-title',
      questionId: expect.any(String),
      title: 'any title',
    })
  })
})
