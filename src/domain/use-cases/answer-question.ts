interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
}

export class AnswerQuestionUseCase {
  execute({ instructorId, questionId }: AnswerQuestionUseCaseRequest) {}
}
