import { expect, describe, it, beforeEach } from 'vitest'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { InMemoryQuestionRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'

describe('DeleteQuestion unit tests', () => {
  let deleteQuestionUseCase: DeleteQuestionUseCase
  let inMemoryQuestionRepository: InMemoryQuestionRepository

  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    deleteQuestionUseCase = new DeleteQuestionUseCase(
      inMemoryQuestionRepository,
    )
  })

  it('should be able to delete a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    const foundQuestion = await inMemoryQuestionRepository.findById(
      createdQuestion.id,
    )

    expect(foundQuestion).toEqual(createdQuestion)

    await deleteQuestionUseCase.execute({
      questionId: createdQuestion.id,
      authorId: createdQuestion.authorId,
    })

    const foundQuestionAfterDeletion =
      await inMemoryQuestionRepository.findById(createdQuestion.id)

    expect(foundQuestionAfterDeletion).not.toBeTruthy()
  })

  it('should not allow a user that is not the author to delete a question', async () => {
    const createdQuestion = makeQuestion()
    await inMemoryQuestionRepository.create(createdQuestion)

    await expect(
      deleteQuestionUseCase.execute({
        authorId: 'any-author-id-that-is-not-the-creator',
        questionId: createdQuestion.id,
      }),
    ).rejects.toThrowError('User not allowed to delete this question')
  })
})
