import { randomUUID } from 'node:crypto'

interface AnswerProps {
  id?: string
  content: string
  authorId: string
  questionId: string
}

export class Answer {
  public id: string
  public content: string
  public authorId: string
  public questionId: string

  constructor(props: AnswerProps) {
    this.id = props.id ?? randomUUID()
    this.content = props.content
    this.authorId = props.authorId
    this.questionId = props.questionId
  }
}
