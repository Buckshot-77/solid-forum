import { expect, describe, it, beforeEach } from 'vitest'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'

const fakeAnswerRepository: AnswerRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (_answer: Answer) => {
    return
  },
}

describe('AnswerQuestion unit tests', () => {
  let answerQuestionUseCase: AnswerQuestionUseCase

  beforeEach(() => {
    answerQuestionUseCase = new AnswerQuestionUseCase(fakeAnswerRepository)
  })

  it('should be able to create an answer', async () => {
    const response = await answerQuestionUseCase.execute({
      content: 'Any content',
      authorId: 'any author id',
      questionId: 'any question id',
    })

    expect(response.content).toBe('Any content')
  })
})
