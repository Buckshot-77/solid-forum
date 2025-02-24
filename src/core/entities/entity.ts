/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueIdentifier } from './value-objects/unique-identifier'

export class Entity<EntityProps> {
  private _id: UniqueIdentifier
  protected _props: EntityProps

  get id(): string {
    return this._id.toString()
  }

  protected constructor(props: EntityProps, id?: UniqueIdentifier) {
    this._id = id ?? new UniqueIdentifier()
    this._props = props
  }

  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }

    if (entity._id === this._id) {
      return true
    }

    return false
  }
}
