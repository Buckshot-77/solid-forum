export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalizes it as a slug.
   *
   *
   * Example: "An example title" -> "an-example-title"
   *
   *
   *
   * @param text {string}
   */

  static createWithoutTreatments(text: string) {
    return new Slug(text)
  }
  static createFromText(text: string) {
    const stringToUse = text.length > 50 ? text.slice(0, 50) : text
    const treatedSlugText = stringToUse
      .normalize('NFKD')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w]+/g, '-')
      .replace(/--/g, '-')
      .replace(/-$/g, '')

    return new Slug(treatedSlugText)
  }
}
