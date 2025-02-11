import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryAnswerRepository } from '@/test/repositories/in-memory-answer-repository'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

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

  it('should return ResourceNotFoundError if no answer is found', async () => {
    const response = await chooseBestAnswerUseCase.execute({
      answerId: 'any-answer-id',
      questionAuthorId: 'any-question-author-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toEqual(
      new ResourceNotFoundError('Answer was not found'),
    )
  })

  it('should return ResourceNotFoundError if answer is found but, bizarrely, using the given questionId does not find a question', async () => {
    const createdAnswer = makeAnswer()

    await answerRepository.create(createdAnswer)

    const response = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: 'any-question-author-id',
    })
    expect(response.isLeft()).toBe(true)
    expect(response.value).toEqual(
      new ResourceNotFoundError('Question was not found'),
    )
  })

  it('should return NotAllowedError if answer and question are found, but the authorId does not match the given authorId', async () => {
    const createdQuestion = makeQuestion()
    const createdAnswer = makeAnswer({
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    await questionRepository.create(createdQuestion)
    await answerRepository.create(createdAnswer)

    const response = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: 'any-question-author-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toEqual(
      new NotAllowedError('Question is not from this author'),
    )
  })

  it('should be able to choose best answer if all previous conditions are met', async () => {
    const createdQuestion = makeQuestion()
    const createdAnswer = makeAnswer({
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    await questionRepository.create(createdQuestion)
    await answerRepository.create(createdAnswer)

    const response = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: createdQuestion.authorId,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      questionId: createdQuestion.id,
      bestAnswerId: createdAnswer.id,
    })
  })
})
