import { expect, describe, it, beforeEach } from 'vitest'
import { AnswerQuestionUseCase } from '@/domain/use-cases/answer-question'
import { Answer } from '@/domain/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

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
    const answer = await answerQuestionUseCase.execute({
      content: 'Any content',
      authorId: 'any author id',
      questionId: 'any question id',
    })

    expect(answer).toBeInstanceOf(Answer)
    expect(answer.content).toBe('Any content')
  })
})
