import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let chooseBestAnswerUseCase: ChooseBestAnswerUseCase

describe('Choose Best Answer unit tests', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    questionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    chooseBestAnswerUseCase = new ChooseBestAnswerUseCase(
      answersRepository,
      questionsRepository,
    )
  })

  it('should return ResourceNotFoundError if no answer is found', async () => {
    const result = await chooseBestAnswerUseCase.execute({
      answerId: 'any-answer-id',
      questionAuthorId: 'any-question-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Answer was not found'),
    )
  })

  it('should return ResourceNotFoundError if answer is found but, bizarrely, using the given questionId does not find a question', async () => {
    const createdAnswer = makeAnswer()

    await answersRepository.create(createdAnswer)

    const result = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: 'any-question-author-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceNotFoundError('Question was not found'),
    )
  })

  it('should return NotAllowedError if answer and question are found, but the authorId does not match the given authorId', async () => {
    const createdQuestion = makeQuestion()
    const createdAnswer = makeAnswer({
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    await questionsRepository.create(createdQuestion)
    await answersRepository.create(createdAnswer)

    const result = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: 'any-question-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new NotAllowedError('Question is not from this author'),
    )
  })

  it('should be able to choose best answer if all previous conditions are met', async () => {
    const createdQuestion = makeQuestion()
    const createdAnswer = makeAnswer({
      questionId: new UniqueIdentifier(createdQuestion.id),
    })

    await questionsRepository.create(createdQuestion)
    await answersRepository.create(createdAnswer)

    const result = await chooseBestAnswerUseCase.execute({
      answerId: createdAnswer.id,
      questionAuthorId: createdQuestion.authorId,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      questionId: createdQuestion.id,
      bestAnswerId: createdAnswer.id,
    })
  })
})
