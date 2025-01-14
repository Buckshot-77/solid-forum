import { randomUUID } from 'node:crypto'

interface StudentProps {
  id?: string
  name: string
}

export class Student {
  public id: string
  public name: string

  constructor(props: StudentProps) {
    this.id = props.id ?? randomUUID()
    this.name = props.name
  }
}
