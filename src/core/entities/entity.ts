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
}
