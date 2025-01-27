import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

let answerRepository: InMemoryAnswerRepository
let questionRepository: InMemoryQuestionRepository

let chooseBestAnswerUseCase: ChooseBestAnswerUseCase

describe('Choose Best Answer unit tests', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    questionRepository = new InMemoryQuestionRepository()
    chooseBestAnswerUseCase = new ChooseBestAnswerUseCase(
      answerRepository,
      questionRepository,
    )
  })

  it('should throw if no answer is found', async () => {
    await expect(
      chooseBestAnswerUseCase.execute({
        answerId: 'any-answer-id',
        questionAuthorId: 'any-question-author-id',
      }),
    ).rejects.toThrowError('Answer was not found')
  })

  it('should throw if answer is found but, bizarrely, using the given questionId does not find a question', async () => {
    const createdAnswer = makeAnswer()

    await answerRepository.create(createdAnswer)

    await expect(
      chooseBestAnswerUseCase.execute({
        answerId: createdAnswer.id,
        questionAuthorId: 'any-question-author-id',
      }),
    ).rejects.toThrowError('Question was not found')
  })

  it('should throw if answer and question are found, but the authorId does not match the given authorId', async () => {
    const createdQuestion = makeQuestion()
    const createdAnswer = makeAnswer({
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    await questionRepository.create(createdQuestion)
    await answerRepository.create(createdAnswer)

    await expect(
      chooseBestAnswerUseCase.execute({
        answerId: createdAnswer.id,
        questionAuthorId: 'any-question-author-id',
      }),
    ).rejects.toThrowError('Question is not from this author')
  })

  it('should be able to choose best answer if all previous conditions are met', async () => {
    const createdQuestion = makeQuestion()
    const createdAnswer = makeAnswer({
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    await questionRepository.create(createdQuestion)
    await answerRepository.create(createdAnswer)

    const { bestAnswerId, questionId } = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: createdQuestion.authorId,
    })

    expect(bestAnswerId).toBe(createdAnswer.id)
    expect(questionId).toBe(createdQuestion.id)
  })
})
