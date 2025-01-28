import {
  randAirportCode,
  randAnimalType,
  randSentence,
  randTextRange,
  randVehicleFuel,
} from '@ngneat/falso'

import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export function makeQuestion(override?: Partial<QuestionProps>) {
  const question = Question.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    title: randSentence(),
    slug: Slug.createWithoutTreatments(
      `${randAnimalType().toLowerCase()}-${randVehicleFuel().toLowerCase()}-${randAirportCode().toLowerCase()}`,
    ),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return question
}
