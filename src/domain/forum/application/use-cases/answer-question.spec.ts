import { expect, describe, it, beforeEach } from 'vitest'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'

describe('AnswerQuestion unit tests', () => {
  let answerQuestionUseCase: AnswerQuestionUseCase
  let inMemoryAnswerRepository: InMemoryAnswerRepository

  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    answerQuestionUseCase = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be able to create an answer', async () => {
    const response = await answerQuestionUseCase.execute({
      content: 'Any content',
      authorId: 'any author id',
      questionId: 'any question id',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value?.answer.content).toEqual('Any content')
    expect(response.value?.answer.authorId).toEqual('any author id')
    expect(response.value?.answer.questionId).toEqual('any question id')
  })
})
