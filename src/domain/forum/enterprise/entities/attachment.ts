import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export interface AttachmentProps {
  title: string
  url: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this._props.title
  }

  get url() {
    return this._props.url
  }

  static create(props: AttachmentProps, id?: UniqueIdentifier) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
