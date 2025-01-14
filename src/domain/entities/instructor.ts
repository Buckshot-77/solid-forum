import { randomUUID } from 'node:crypto'

interface InstructorProps {
  id?: string
  name: string
}

export class Instructor {
  public id: string
  public name: string

  constructor(props: InstructorProps) {
    this.id = props.id ?? randomUUID()
    this.name = props.name
  }
}
