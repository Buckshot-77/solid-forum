import { UseCaseError } from '@/core/errors/use-case-error'

export class PaginationError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
    this.message = message
  }
}
