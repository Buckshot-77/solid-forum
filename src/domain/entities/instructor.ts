import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueIdentifier): Instructor {
    const question = new Instructor(props, id)

    return question
  }
}
