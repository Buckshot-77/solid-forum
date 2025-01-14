import { randomUUID } from 'node:crypto'

interface AnswerProps {
  id?: string
  content: string
}

export class Answer {
  public id: string
  public content: string

  constructor(props: AnswerProps) {
    this.id = props.id ?? randomUUID()
    this.content = props.content
  }
}
