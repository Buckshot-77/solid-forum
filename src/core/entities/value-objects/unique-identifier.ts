import { randomUUID } from 'node:crypto'

export class UniqueIdentifier {
  private _value: string

  toString(): string {
    return this._value
  }

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  public equals(uniqueIdentifier: UniqueIdentifier) {
    if (uniqueIdentifier === this) {
      return true
    }

    if (uniqueIdentifier._value === this._value) {
      return true
    }

    return false
  }
}
