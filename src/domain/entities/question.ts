import { randomUUID } from 'node:crypto'

interface QuestionProps {
  id?: string
  title: string
  content: string
}

export class Question {
  public id: string
  public title: string
  public content: string

  constructor(props: QuestionProps) {
    this.id = props.id ?? randomUUID()
    this.title = props.title
    this.content = props.content
  }
}
