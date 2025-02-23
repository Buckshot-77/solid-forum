import { expect, describe, it, beforeEach } from 'vitest'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

describe('AnswerQuestion unit tests', () => {
  let answerQuestionUseCase: AnswerQuestionUseCase
  let inMemoryAnswersRepository: InMemoryAnswersRepository

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    answerQuestionUseCase = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await answerQuestionUseCase.execute({
      content: 'Any content',
      authorId: 'any author id',
      questionId: 'any question id',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('Any content')
    expect(result.value?.answer.authorId).toEqual('any author id')
    expect(result.value?.answer.questionId).toEqual('any question id')
  })
})
